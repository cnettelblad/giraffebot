"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChickenEvent_1 = require("./ChickenEvent");
const MySQLConnection_1 = require("../../database/MySQLConnection");
const discord_js_1 = require("discord.js");
/**
 * Chicken Game!
 *
 * Randomly spawns a chicken event where there's activity.
 */
class ChickenGame {
    /**
     * Class constructor
     * @param commandHandler CommandHandler
     */
    constructor(commandHandler) {
        /**
         * @var events Array of active ChickenEvent(s)
         */
        this.events = [];
        /**
         * @var eventChance number - Percentage for event to occur
         */
        this.eventChance = 1;
        /**
         * Initialize the ChickenGame
         *
         * @returns void
         */
        this.init = () => {
            this.hookCommands();
        };
        /**
         * Adds listeners for commands with callback
         *
         * @returns void
         */
        this.hookCommands = () => {
            this.commandHandler.on('general', this.rollTheDice);
            this.commandHandler.on('save', this.saveChicken);
            this.commandHandler.on('chickens', this.getOwnChickens);
            this.commandHandler.on('cockfight', this.cockfight);
            this.commandHandler.on('leaderboards', this.getLeaderboards);
            // Owner Commands
            this.commandHandler.on('give', this.giveChickens);
            this.commandHandler.on('forceTheDice', this.forceTheDice);
        };
        /**
         * Roll the dice!
         *
         * Every time function is triggered in a Discord.TextChannel it
         * has a chance to trigger a new ChickenEvent in that channel, based
         * on ChickenGame.eventChance.
         *
         * @see ChickenGame.eventChance
         * @param msg Discord.Message
         * @returns void
         */
        this.rollTheDice = (msg) => {
            if (msg.channel instanceof discord_js_1.TextChannel && !this.events[msg.channel.id]) {
                if (Math.floor(Math.random() * 101) > (100 - this.eventChance)) {
                    console.log('\x1b[32m%s\x1b[0m', `New chicken event in: ${msg.channel.id}`);
                    this.events[msg.channel.id] = new ChickenEvent_1.default(msg.channel);
                    this.events[msg.channel.id].activate();
                }
            }
        };
        /**
         * Force the dice!
         *
         * Owner command to just trigger a ChickenEvent manually
         *
         * @param message Discord.Message
         * @returns void
         */
        this.forceTheDice = (message) => {
            if (message.author.id !== '95458468462342144') {
                return;
            }
            const { channel } = message;
            if (channel instanceof discord_js_1.TextChannel) {
                this.events[channel.id] = new ChickenEvent_1.default(channel);
                const event = this.events[channel.id];
                event.activate();
            }
        };
        /**
         * Save the fleeing chicken!
         *
         * If triggered when a chicken event is active in the same
         * channel, then the user will be granted the saved chicken.
         *
         * @param message Discord.Message
         * @returns void
         */
        this.saveChicken = (message) => {
            if (this.events[message.channel.id]) {
                console.log('\x1b[36m%s\x1b[0m%s', 'Chicken event completed by: ', message.author.username);
                this.events[message.channel.id].claimChicken(message);
                delete this.events[message.channel.id];
            }
        };
        /**
         * Display how many chickens requester has.
         *
         * @param message Discord.Message
         * @returns void
         */
        this.getOwnChickens = (message) => {
            MySQLConnection_1.default.query(`SELECT chickens FROM users WHERE userid = ${message.author.id}`, (e, r, f) => {
                this.sendOwnChickensMsg(r, message).then((m) => {
                    message.delete();
                    m.delete(15000);
                });
            });
        };
        /**
         * Displays the leaderboards in the requesters channel.
         *
         * @param message Discord.Message
         * @returns void
         */
        this.getLeaderboards = (message) => {
            MySQLConnection_1.default.query('SELECT userid, username, chickens FROM users ORDER BY chickens DESC LIMIT 10', (e, r, f) => {
                if (e) {
                    console.log(e);
                }
                this.sendLeaderboardsMsg(r, message).then((m) => {
                    message.delete();
                });
            });
        };
        /**
         * Owner Command.
         *
         * Give a user x chicken(s).
         *
         * @param message Discord.Message
         * @param to string user to give the chickens to
         * @param quantity string | number amount of chickens to give
         * @returns void
         */
        this.giveChickens = (message, to = '', quantity = 0) => {
            if (message.author.id !== '95458468462342144') {
                return;
            }
            if (!to || !quantity) {
                return;
            }
            const regex = to.match(/<@!?(\d*)>/);
            if (!regex[1] || !regex[1].match(/^[0-9]{17,18}$/)) {
                console.log('somethin fishy');
                return;
            }
            const recipient = regex[1];
            MySQLConnection_1.default.query('UPDATE users SET chickens = chickens + ? WHERE userid = ?', [quantity, recipient], (error, results, fields) => {
                if (error) {
                    return console.log(error);
                }
                message.channel.send(`Giving ${quantity} chicken(s) to ${to}`).then((m) => m.delete(15000));
            });
        };
        /**
         * Nothing beats a good old fashioned cock-fight!
         * 50/50 all the way!
         *
         * @param message Discord.Message
         * @param victim Discord user mention
         */
        this.cockfight = (message, victim) => {
            if (!/^<@!?[0-9]{17,18}>$/.test(victim)) {
                message.channel.send('Usage: `!cockfight [@user]`');
            }
            const target = victim.replace(/[<@!>]/g, '');
            const attacker = message.author.id;
            if (attacker === target) {
                message.channel.send('You cannot attack yourself.. idiot').then((m) => m.delete(10000));
                return;
            }
            MySQLConnection_1.default.query('SELECT chickens FROM users WHERE userid IN (?, ?)', [attacker, target], (e, r, f) => {
                if (e) {
                    console.log(e);
                    return;
                }
                if (r.length !== 2 || !(r[0].chickens >= 10 && r[1].chickens >= 10)) {
                    message.channel.send('Both the attacker and the attacked must have at least 10 chickens!');
                    return;
                }
                const winner = Math.floor(Math.random() * 101) > 49 ? attacker : target;
                const loser = (winner === attacker) ? target : attacker;
                message.channel.send(`<@${winner}> beats <@${loser}> in a cockfight
          and walks away with 10 of their chickens.`);
                MySQLConnection_1.default.query('UPDATE users SET chickens = chickens + 10 WHERE userid = ?', [winner], (e) => {
                    if (e) {
                        console.log(e);
                        return;
                    }
                    MySQLConnection_1.default.query('UPDATE users SET chickens = chickens - 10 WHERE userid = ?', [loser], (e) => {
                        if (e) {
                            console.log(e);
                        }
                    });
                });
            });
        };
        /**
         * Responds to !chickens command.
         * @access private
         * @param chickens Chickens array
         * @param message Discord.Message
         */
        this.sendOwnChickensMsg = (chickens, message) => {
            let msg;
            if (chickens[0] !== undefined && chickens[0].chickens) {
                msg = ` you have **${chickens[0].chickens}** chicken(s) at your disposal.`;
            }
            else {
                msg = ' It seems like you don\'t have any chickens.';
            }
            return message.reply(msg);
        };
        /**
         * Outputs the leaderboards.
         *
         * @param users Users array
         * @param message Discord.Message
         * @returns Promise<Message | Message[]>
         */
        this.sendLeaderboardsMsg = (users, message) => {
            let scores = '';
            for (let i = 0; i < users.length; i += 1) {
                scores += `${i + 1} - ${users[i].username} : ${users[i].chickens} chickens\n`;
            }
            return message.channel.send({
                embed: {
                    title: 'Chicken Leaderboards',
                    description: 'Only the most ambitious chicken-savers from PETA will make it here.',
                    color: 19942,
                    fields: [
                        {
                            name: 'Top activists',
                            value: scores
                        }
                    ]
                }
            });
        };
        this.commandHandler = commandHandler;
    }
}
exports.default = ChickenGame;
//# sourceMappingURL=ChickenGame.js.map
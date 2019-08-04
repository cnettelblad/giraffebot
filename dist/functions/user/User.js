"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * User "controller"
 *
 * Methods related to user-specific events, may be
 * broken into more specific objects in the future.
 */
class User {
    /**
     * User constructor
     *
     * @param commandHandler CommandHandler object
     */
    constructor(commandHandler) {
        /**
         * Initialize the User class
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
            this.commandHandler.on('age', this.getAge);
            this.commandHandler.on('spit', this.spit);
        };
        /**
         * Displays when the requesters account was created.
         *
         * @see https://discordapp.com/developers/docs/reference#convert-snowflake-to-datetime
         * @param msg Discord.Message object
         * @returns void
         */
        this.getAge = (msg) => {
            const age = (parseInt(msg.author.id, 10) / 4194304) + 1420070400000;
            msg.reply(`your account was created: ${new Date(age).toLocaleDateString()}`);
        };
        /**
         * For the angry users, let of some steam.. or saliva.
         *
         * @param msg Discord.Message object
         * @param victim Optional Discord user mention
         * @param part Body part to aim for.. I may have gone to far..
         * @returns void
         */
        this.spit = (msg, victim, part) => {
            let text;
            // Creating a silly loop here so I dont have to add 4x ".then"
            while (true) {
                if (!victim) {
                    text = 'Spits violently on the ground';
                    break;
                }
                if (!/^<@!?[0-9]*$>/.test(victim) || !/^[a-zA-Z\s\-]*$/.test(part)) {
                    text = 'Usage: `!spit [@user] [part: optional]`';
                    break;
                }
                if (!part) {
                    text = `Spits at ${victim}`;
                    break;
                }
                text = `Spits ${victim} in the ${part}`;
                break;
            }
            msg.channel.send(text).then((m) => m.delete(20000));
        };
        this.commandHandler = commandHandler;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map
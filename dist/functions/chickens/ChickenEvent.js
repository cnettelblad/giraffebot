"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MySQLConnection_1 = require("../../database/MySQLConnection");
class ChickenEvent {
    constructor(channel) {
        this.CURSED_ID = '146757873043636224';
        this.channel = channel;
        this.active = false;
    }
    activate() {
        this.active = true;
        this.announceEvent().then(msg => this.announceMsg = msg);
        return this;
    }
    deactivate() {
        this.active = false;
        return this;
    }
    announceEvent() {
        return this.channel.send({
            embed: {
                title: 'Fleeing chicken',
                description: `You spot a chicken running for its life,
          quickly catch it before CursedEgg does!`,
                color: 19942,
                image: {
                    url: 'https://i.imgur.com/cOOMuze.png'
                },
                fields: [
                    {
                        name: 'Type !save to rescue the chicken.',
                        value: 'Hurry up!'
                    }
                ]
            }
        });
    }
    claimChicken(message) {
        if (this.announceMsg !== undefined) {
            this.deactivate();
            this.announceMsg.delete();
            this.announceWinner(message);
            this.saveChicken(message.author);
        }
    }
    announceWinner(message) {
        let msg;
        if (message.author.id === this.CURSED_ID) {
            msg = 'Oh no, **CursedEgg** got to the chicken first! **COVER YOUR EYES!**';
        }
        else {
            const winner = message.author.username;
            msg = `${winner} saved the chicken!`;
        }
        message.channel.send(msg).then((m) => {
            m.delete(10000);
        });
    }
    saveChicken(user) {
        MySQLConnection_1.default.query(`INSERT INTO users
      (userid, username, chickens) VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE
        \`username\`= ?,
        \`chickens\`= chickens + 1
      `, [user.id, user.username, user.username], (error, results, fields) => {
            if (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ChickenEvent;
//# sourceMappingURL=ChickenEvent.js.map
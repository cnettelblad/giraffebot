"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * Parent for any bot method controller.
 * Emits events when commands is found.
 */
class CommandHandler extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        /**
         * Executes a command that has a listener.
         *
         * @param command The command
         * @param message The Discord.Message object
         * @param args Any arguments for the command.
         * @returns void
         */
        this.executeCommand = (command, message, ...args) => {
            console.log('\x1b[31m%s\x1b[0m%s', `${message.author.username} issued command: `, command);
            this.emit(command, message, ...args);
            message.delete();
        };
        /**
         * This method is called if the message
         * does not have a command prefix.
         *
         * Useful for logging and/or monitoring.
         * @param message Discord.Message
         * @returns void
         */
        this.generalMessage = (message) => {
            this.emit('general', message);
        };
    }
    /**
     * Check if there are any active listeners
     * for the provided command.
     * @param command Command string
     * @returns boolean
     */
    isCommand(command) {
        return this.listeners(command).length !== 0;
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map
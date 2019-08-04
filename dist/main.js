"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Env = require("dotenv");
const Discord = require("discord.js");
const MessageHandler_1 = require("./utils/MessageHandler");
const CommandHandler_1 = require("./utils/CommandHandler");
const FunctionHandler_1 = require("./functions/FunctionHandler");
// Boot up our environment vars
Env.config();
// Set up our handlers and Discord Client
const commandHandler = new CommandHandler_1.default();
const functionHandler = new FunctionHandler_1.default(commandHandler);
const messageHandler = new MessageHandler_1.default(commandHandler);
const client = new Discord.Client();
// Wait until the client is ready and initiate bot functionality
client.once('ready', () => {
    console.log('\x1b[36m%s\x1b[0m', 'Discord Client API ready.');
    console.log('\x1b[35m%s\x1b[0m', 'Initializing Bot functionality.');
    functionHandler.init();
    console.log('\x1b[32m%s\x1b[0m', 'Bot is ready and running!');
});
// Process messages
client.on('message', messageHandler.processMessage);
// Login with bot token
client.login(process.env.APP_TOKEN);
//# sourceMappingURL=main.js.map
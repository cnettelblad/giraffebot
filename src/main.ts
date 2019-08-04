import * as Env from 'dotenv'
import * as Discord from 'discord.js'
import MessageHandler from './utils/MessageHandler'
import CommandHandler from './utils/CommandHandler'
import FunctionHandler from './functions/FunctionHandler'

// Boot up our environment vars
Env.config();

// Set up our handlers and Discord Client
const commandHandler = new CommandHandler()
const functionHandler = new FunctionHandler(commandHandler)
const messageHandler = new MessageHandler(commandHandler)
const client = new Discord.Client();

// Wait until the client is ready and initiate bot functionality
client.once('ready', () => {
  console.log('\x1b[36m%s\x1b[0m', 'Discord Client API ready.')
  console.log('\x1b[35m%s\x1b[0m', 'Initializing Bot functionality.')
  functionHandler.init()
  console.log('\x1b[32m%s\x1b[0m', 'Bot is ready and running!')
});

// Process messages
client.on('message', messageHandler.processMessage)

// Login with bot token
client.login(process.env.APP_TOKEN);

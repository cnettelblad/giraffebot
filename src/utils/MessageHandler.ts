import { Message } from 'discord.js'
import CommandHandler from './CommandHandler'

/**
 * Message handler
 *
 * Handles all messages
 * @todo Add processing for edited messages etc
 */
export default class MessageHandler
{
  /**
   * @var commandHandler CommandHandler object
   */
  public commandHandler: CommandHandler

  /**
   * MessageHandler constructor
   *
   * @param commandHandler CommandHandler object
   */
  constructor(commandHandler: CommandHandler)
  {
    this.commandHandler = commandHandler
  }

  /**
   * Checks message if it looks like a command or a regular message.
   *
   * Depending on results - tell commandHandler to emit different events.
   *
   * @param message Discord.Message
   * @returns void
   */
  public processMessage = (message: Message): void =>
  {
    const prefix = message.content.substr(0, process.env.CMD_PREFIX.length)
    const msg = message.content.substr(process.env.CMD_PREFIX.length)
    const parts = msg.split(/\s/g)

    this.checkForCommand(prefix, parts[0]).then((r) => {
      // console.log('command')
      this.commandHandler.executeCommand(parts.shift(), message, ...parts)
    }).catch((e) => {
      if (e === 1) {
        this.commandHandler.generalMessage(message)
      } else if (e === 2) {
        console.log(
          '\x1b[33m%s\x1b[31m%s\x1b[0m%s',
          message.author.username,
          ' tried to issue a command that does not exist: ',
          message.content
        )
      }
    })
  }

  /**
   * Check if a command has been called and if so, if it exists.
   *
   * @todo Add user-level HERE instead
   * @param prefix command prefix, eg. !
   * @param command actual command string
   * @returns Promise with a status code.
   */
  public checkForCommand = (prefix: string, command: string): Promise<number> =>
  {
    return new Promise((resolve, reject) => {
      if (prefix !== process.env.CMD_PREFIX) {
        reject(1)
      } else if (!this.commandHandler.isCommand(command)) {
        reject(2)
      }

      resolve(1)
    })
  }
}

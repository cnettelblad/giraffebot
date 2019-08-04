import { EventEmitter } from 'events';
import { Message } from 'discord.js';

/**
 * Parent for any bot method controller.
 * Emits events when commands is found.
 */
export default class CommandHandler extends EventEmitter
{
  /**
   * Executes a command that has a listener.
   *
   * @param command The command
   * @param message The Discord.Message object
   * @param args Any arguments for the command.
   * @returns void
   */
  public executeCommand = (
    command: string,
    message: Message,
    ...args: string[]
    ): void =>
  {
    console.log(
      '\x1b[31m%s\x1b[0m%s',
      `${message.author.username} issued command: `,
      command
    )
    this.emit(command, message, ...args)
    message.delete()
  }

  /**
   * This method is called if the message
   * does not have a command prefix.
   *
   * Useful for logging and/or monitoring.
   * @param message Discord.Message
   * @returns void
   */
  public generalMessage = (message: Message): void =>
  {
    this.emit('general', message)
  }

  /**
   * Check if there are any active listeners
   * for the provided command.
   * @param command Command string
   * @returns boolean
   */
  public isCommand(command: string): boolean
  {
    return this.listeners(command).length !== 0
  }
}

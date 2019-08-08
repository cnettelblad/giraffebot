import CommandHandler from '../utils/CommandHandler'
import { ChickenGame } from './chickens/'
import { User } from './user/'

/**
 * Handles all the functionality related to the bot.
 *
 * By injecting a CommandHandler object we can bind
 * all the functions to the same event emitter and
 * thus not have to instantiate multiple functions
 * inside the Discord.Message listener.
 */
export default class FunctionHandler
{
  /**
   * @var commandHandler CommandHandler object
   */
  public commandHandler

  /**
   * Class constructor
   *
   * @param commandHandler CommandHandler object
   * @returns void
   */
  constructor(commandHandler: CommandHandler)
  {
    this.commandHandler = commandHandler
  }

  /**
   * Initializes all the functions related to the bot
   *
   * @returns void
   */
  public init = () =>
  {
    const chickens = new ChickenGame(this.commandHandler)
    const user = new User(this.commandHandler)
    chickens.init()
    user.init()
  }
}

import CommandHandler from '../utils/CommandHandler'
import { ChickenGame } from './chickens/'
import { User } from './user/'

export default class FunctionHandler
{
  public commandHandler
  constructor(commandHandler: CommandHandler)
  {
    this.commandHandler = commandHandler
  }

  public init = () =>
  {
    const chickens = new ChickenGame(this.commandHandler)
    const user = new User(this.commandHandler)
    chickens.init()
    user.init()
  }
}

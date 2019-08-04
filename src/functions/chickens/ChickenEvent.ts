import {
    Message,
    TextChannel,
    User
} from 'discord.js'
import db from '../../database/MySQLConnection'

export default class ChickenEvent {
  protected channel: TextChannel
  protected active: boolean
  protected announceMsg: Message

  private readonly CURSED_ID: string = '146757873043636224'

  constructor(channel: TextChannel)
  {
    this.channel = channel
    this.active = false
  }

  public activate(): this
  {
    this.active = true
    this.announceEvent().then(msg => this.announceMsg = msg)
    return this
  }

  public deactivate(): this
  {
    this.active = false
    return this
  }

  public announceEvent(): Promise<Message>
  {
    return this.channel.send({
      embed: {
        title: 'Fleeing chicken',
        description:
          `You spot a chicken running for its life,
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
    }) as Promise<Message>
  }

  public claimChicken(message: Message)
  {
    if (this.announceMsg !== undefined) {
      this.deactivate()
      this.announceMsg.delete()
      this.announceWinner(message)
      this.saveChicken(message.author)
    }
  }

  public announceWinner(message: Message): void
  {
    let msg: string
    if (message.author.id === this.CURSED_ID) {
      msg = 'Oh no, **CursedEgg** got to the chicken first! **COVER YOUR EYES!**'
    } else {
      const winner: string = message.author.username
      msg = `${winner} saved the chicken!`
    }
    message.channel.send(msg).then((m: Message) => {
      m.delete(10000)
    })
  }

  protected saveChicken(user: User)
  {
    db.query(
      `INSERT INTO users
      (userid, username, chickens) VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE
        \`username\`= ?,
        \`chickens\`= chickens + 1
      `,
      [user.id, user.username, user.username],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
      }
    )
  }
}

const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class SupportCommand extends Command {
  constructor(client) {
    super(client, {
      name: "vote",
      description: "Checks your daily votes.",
      category: "System",
      usage: "vote"
    });
  }

  formatDate(milliseconds) {
    milliseconds = Math.floor(milliseconds / 1000);
    const seconds = milliseconds % 60;
    milliseconds /= 60;
    const minutes = Math.floor(milliseconds % 60);
    milliseconds /= 60;
    const hours = Math.floor(milliseconds % 24);

    return `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${seconds > 0 ? seconds + " seconds" : ""}`;
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);
    const vote = await this.client.shopHandler.getVotes(message);

    if (vote) {
      if (vote.claimed == false) {
        await this.client.shops.updateOne({
          userId: message.author?.id ?? message.user?.id
        }, {
          $inc: {
            money: 100
          }
        });

        await this.client.votes.updateOne({
          userId: message.author?.id ?? message.user?.id
        }, {
          claimed: true
        });

        const embed = new Discord.MessageEmbed()
          .setTitle("Ice Cream Shop")
          .setDescription("Thanks for voting! You have been rewarded $100 for voting for our bot. Make sure to vote again in 12 hours!")
          .setColor(0x00FF00)
          .setThumbnail(this.client.user.displayAvatarURL())
          .setFooter('/help', this.client.user.displayAvatarURL())
          .setTimestamp();

        message.reply({ embeds: [embed] });
      } else {
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author?.tag ?? message.user?.tag, message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL())
          .setTitle(profile.name)
          .setDescription(`Error while claiming vote rewards:
            
Please wait ${this.formatDate(43200000 - (Date.now() - Date.parse(vote.createdAt)))}.`)
          .setColor(0xFF0000)
          .setFooter('/help', this.client.user.displayAvatarURL())
          .setTimestamp();

        message.reply({ embeds: [embed] });
      }
    } else {
      const embed = new Discord.MessageEmbed()
        .setTitle("Ice Cream Shop")
        .setDescription("You have not voted yet! You can vote here: https://top.gg/bot/765627044687249439/vote")
        .setColor(0xFF0000)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setFooter('/help', this.client.user.displayAvatarURL())
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  }
}
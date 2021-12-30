const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class BalanceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "balance",
      description: "Shows your current balance",
      category: "Economy",
      usage: "balance"
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author?.tag ?? message.user?.tag, message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL())
      .setTitle(profile.name)
      .setDescription(`💰 $${profile.money}`)
      .setColor(0x00FF00)
      .setFooter('/help', this.client.user.displayAvatarURL())
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
}
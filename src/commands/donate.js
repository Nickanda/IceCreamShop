const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class DonateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "donate",
      description: "Shows donation information",
      category: "System",
      usage: "donate"
    });
  }

  async run(message, args) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Ice Cream Shop")
      .addField("Developer", "NicholasY#4815", true)
      .addField("Donate", "[Click here!](https://www.buymeacoffee.com/NicholasY4815)", true)
      .setColor(0x00FF00)
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter('i!help', this.client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
}
const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class FlavorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "flavors",
      description: "Shows the flavors that you currently have",
      category: "Shop",
      usage: "flavors"
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);

    const embed = new Discord.MessageEmbed()
      .setAuthor({
        name: message.author?.tag ?? message.user?.tag,
        iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
      })
      .setTitle(profile.name)
      .setDescription(`You currently have these flavors: ${profile.flavors.join(', ')}`)
      .setColor(0x00FF00)
      .setFooter({
        text: '/help',
        iconURL: this.client.user.displayAvatarURL()
      })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
}
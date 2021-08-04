const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class InviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "Shows bot invite information",
      category: "System",
      usage: "invite"
    });
  }

  async run(message, args) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Ice Cream Shop")
      .addField("Invite Link", "[Invite Me!](https://discord.com/oauth2/authorize?client_id=765627044687249439&scope=applications.commands%20bot&permissions=347200)", true)
      .setColor(0x00FF00)
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter('i!help', this.client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
}
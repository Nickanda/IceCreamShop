const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class NameCommand extends Command {
  constructor(client) {
    super(client, {
      name: "name",
      description: "Renames your shop",
      category: "Economy",
      usage: "name <new_name>",
      options: [
        {
          type: "STRING",
          name: "new_name",
          description: "The new name of your shop, up to 30 characters",
          required: true
        }
      ]
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);
    const name = args.join(" ");

    if (name.length < 30) {
      await this.client.shops.updateOne({
        userId: message.author?.id ?? message.user?.id
      }, {
        $set: {
          name: name
        }
      });

      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author?.tag ?? message.user?.tag, message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Your shop name has successfully been updated to ${name}!`)
        .setColor(0x00FF00)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } else {
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author?.tag ?? message.user?.tag, message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Please keep your new shop name under 30 characters!`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  }
}
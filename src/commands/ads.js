const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class AdsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ads",
      description: "Shows the ads that you are currently running",
      category: "Shop",
      usage: "ads",
      aliases: ["advertisements", "advertisement", "ad"]
    });
  }

  ormatDate(milliseconds) {
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

    let advertisements = "";
    profile.advertisements.forEach(advertisement => {
      if (Date.now() - Date.parse(val[0]) < val[1]) {
        advertisements += `\n${key}: ${this.formatDate(Date.new(val[1] - Date.now() - Date.parse(val[0])))}`;
      }
    });

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(profile.name)
      .setDescription(`Current Advertisements: ${advertisements == "" && "none active" || advertisements}`)
      .setColor(0x00FF00)
      .setFooter('i!help', this.client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send(embed);
  }
}
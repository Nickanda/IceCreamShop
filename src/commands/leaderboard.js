const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class LeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      description: "Shows the leaderboards based on the amount of money.",
      category: "Economy",
      usage: "leaderboard"
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);

    const leaderboards = await this.client.shops.find({}, {
      order: { "money": -1 },
      limit: 10
    }).toArray();

    let lbInsert = "";
    leaderboards.sort((a, b) => b.money - a.money).forEach(async (shop, ind) => {
      const user = await this.client.users.fetch(shop.userId);
      lbInsert += `\n${ind + 1}. ${user.tag} - $${shop.money}`;
    })

    await this.client.wait(500);

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author?.tag ?? message.user?.tag, message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL())
      .setTitle(profile.name)
      .setDescription(`Top 10 Money Leaderboard: \n${lbInsert}`)
      .setColor(0x00FF00)
      .setFooter('i!help', this.client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
}
const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class DailyCommand extends Command {
  constructor(client) {
    super(client, {
      name: "daily",
      description: "Shows the ads that you are currently running",
      category: "Economy",
      usage: "daily"
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);

    try {
      const success = await this.client.shopHandler.claimDaily(message);

      if (success) {
        const dailyReward = profile.dailyStreak + 1 == 5 ? 200 : 50;

        const embed = new Discord.MessageEmbed()
          .setAuthor({
            name: message.author?.tag ?? message.user?.tag,
            iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
          })
          .setTitle(profile.name)
          .setDescription(`Your daily reward of $${dailyReward} has been claimed!

Daily Streak: ${profile.dailyStreak + 1} days
Reach Day 5 to earn $200 daily rewards instead of $50!`)
          .setColor(0x00FF00)
          .setFooter({
            text: '/help',
            iconURL: this.client.user.displayAvatarURL()
          })
          .setTimestamp();

        message.reply({ embeds: [embed] });
      }
    } catch (e) {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`Error while claiming your daily reward:
                
${e}`)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  }
}
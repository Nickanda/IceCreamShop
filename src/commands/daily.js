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
        const success, reason = await this.client.shopHandler.claimDaily(message);
        const profile = await this.client.shopHandler.getProfile(message);

        if (success) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription("Your daily reward of $50 has been claimed!")
                .setColor(0x00FF00)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription(`Error while claiming your daily reward:
                
                    ${reason}`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        }
    }
}
const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class SupportCommand extends Command {
    constructor(client) {
        super(client, {
            name: "vote",
            description: "Checks your daily votes.",
            category: "System",
            usage: "vote",
            enabled: false
        });
    }

    async run(message, args) {
        const voted = await this.client.dbl.hasVoted(message.author.id);

        if (voted) {
            await profile.increment("money", {
                where: {
                    userId: message.author.id
                },
                by: 100
            });

            const embed = new Discord.MessageEmbed()
                .setTitle("Ice Cream Shop")
                .setDescription("Thanks for voting! You have been rewarded $100 for voting for our bot. Make sure to vote again in 12 hours!")
                .setColor(0x00FF00)
                .setThumbnail(this.client.user.displayAvatarURL())
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();
            
            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle("Ice Cream Shop")
                .setDescription("You have not voted yet! You can vote here: https://top.gg/bot/765627044687249439/vote")
                .setColor(0xFF0000)
                .setThumbnail(this.client.user.displayAvatarURL())
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();
            
            message.channel.send(embed);
        }
    }
}
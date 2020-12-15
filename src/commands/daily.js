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
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.get('name'))
                    .setDescription("Your daily reward of $50 has been claimed!")
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
            }
        } catch (e) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription(`Error while claiming your daily reward:
                
${e}`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        }
    }
}
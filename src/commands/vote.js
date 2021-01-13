const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class SupportCommand extends Command {
    constructor(client) {
        super(client, {
            name: "vote",
            description: "Checks your daily votes.",
            category: "System",
            usage: "vote"
        });
    }

    formatDate(milliseconds) {
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
        const cooldown = await this.client.shopHandler.getCooldowns(message, "vote");

        const voted = await this.client.dbl.hasVoted(message.author.id);

        if (voted) {
            if (!cooldown || Date.now() - Date.parse(cooldown.createdAt) > cooldown.duration) {
                await this.client.shops.updateOne({
                    userId: message.author.id
                }, {
                    money: profile.money + 100,
                });

                if (cooldown) await cooldown.destroy();

                await this.client.cooldowns.insertOne({
                    userId: message.author.id,
                    action: "vote",
                    duration: 43200000,
                    createdAt: Date()
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
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.get('name'))
                    .setDescription(`Error while claiming vote rewards:
            
Please wait ${this.formatDate(cooldown.duration - (Date.now() - Date.parse(cooldown.createdAt)))}.`)
                    .setColor(0xFF0000)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
            }
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
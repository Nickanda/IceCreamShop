const Discord = require('discord.js');
const moment = require('moment');

const Command = require('../structures/Command');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "balance",
            description: "Shows your current balance",
            category: "Economy",
            usage: "balance",
            aliases: []
        });
    }

    async run(message, args) {
        const profile = await this.client.shopHandler.getProfile(message);

        const embed = new Discord.MessageEmbed()
            .setTitle(profile.get('name'))
            .setDescription(`💰 $${profile.get('money')}`)
            .setColor(0x00FF00)
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();

        message.channel.send(embed);
    }
}
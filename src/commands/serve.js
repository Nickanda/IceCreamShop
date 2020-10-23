const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class ServeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "serve",
            description: "Shows your current balance",
            category: "Economy",
            usage: "serve"
        });
    }

    async run(message, args) {
        const profile = await this.client.shopHandler.getProfile(message);

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(profile.get('name'))
            .setDescription(`💰 $${profile.get('money')}`)
            .setColor(0x00FF00)
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();

        message.channel.send(embed);
    }
}
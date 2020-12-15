const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class MachinesCommand extends Command {
    constructor(client) {
        super(client, {
            name: "machines",
            description: "Shows the ads that you are currently running",
            category: "Economy",
            usage: "machines"
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
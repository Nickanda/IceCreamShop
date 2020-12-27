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

    async run(message, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Ice Cream Shop")
            .addField("Support Server", "https://discord.gg/sXkpG2J", true)
            .addField("Invite Link", "[Invite Me!](https://discord.com/oauth2/authorize?client_id=765627044687249439&scope=bot&permissions=347200)", true)
            .setColor(0x00FF00)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();
        
        message.channel.send(embed);
    }
}
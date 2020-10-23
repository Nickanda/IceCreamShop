const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class DonateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "donate",
            description: "Shows bot information",
            category: "System",
            usage: "donate"
        });
    }

    async run(message, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Ice Cream Shop")
            .addField("Developer", "NicholasY#4815", true)
            .addField("Support Server", "https://discord.gg/sXkpG2J", true)
            .addField("Invite Link", "[Invite Me!](https://discord.com/oauth2/authorize?client_id=765627044687249439&scope=bot&permissions=8)", true)
            .addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField("Library", `Discord.JS v${Discord.version}`, true)
            .setColor(0x00FF00)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();
        
        message.channel.send(embed);
    }
}
const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class AdsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ads",
            description: "Shows the ads that you are currently running",
            category: "Shop",
            usage: "ads",
            aliases: ["advertisements", "advertisement", "ad"]
        });
    }

    async run(message, args) {
        const profile = await this.client.shopHandler.getProfile(message);

        let advertisements = "";
        for (const [key, val] of Object.entries(JSON.parse(profile.advertisements))) {
            if (Date.now() - Date.parse(val[0]) < val[1]) {
                advertisements += `\n${key}: ${this.formatDate(Date.new(val[1] - Date.now() - Date.parse(val[0])))}`;
            }
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(profile.name)
            .setDescription(`Current Advertisements: ${advertisements == "" && "none active" || advertisements}`)
            .setColor(0x00FF00)
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();

        message.channel.send(embed);
    }
}
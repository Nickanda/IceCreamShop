const Discord = require('discord.js');
const moment = require('moment');

const Command = require('../structures/Command');

module.exports = class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "Shows your ice cream shop profile",
            category: "Economy",
            usage: "profile",
            aliases: []
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
        const capacity = await this.client.shopHandler.refreshMachineCapacity(message);
        const profile = await this.client.shopHandler.getProfile(message);

        let advertisements = "";
        for (const [key, val] of Object.entries(JSON.parse(profile.advertisements))) {
            if (Date.now() - Date.parse(val[0]) < val[1]) {
                advertisements += `${key}: ${this.formatDate(Date.new(val[1] - Date.now() - Date.parse(val[0])))}`;
            }
        }

        let machineCap = "";
        for (const [key, val] of Object.entries(capacity)) {
            machineCap += `\n${val.type} Machine ${key} (${val.flavor}): ${val.capacity}%`;
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(profile.name)
            .setDescription(`💰 $${profile.money}
Maximum customers in your shop: ${profile.customerMax}

Machine Capacity: ${machineCap}

Flavors: ${JSON.parse(profile.flavors).join(', ')}

Advertisements: ${advertisements == "" && "none active" || advertisements}`)
            .setColor(0x00FF00)
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();

        message.channel.send(embed);
    }
}
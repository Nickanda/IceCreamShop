const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class StoreCommand extends Command {
    constructor(client) {
        super(client, {
            name: "store",
            description: "Shows the store for you to buy new items",
            category: "Shop",
            usage: "store <ads/flavors/machines/buy> [ID]"
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
        const category = args[0];

        const profile = await this.client.shopHandler.getProfile(message);

        switch(category) {
            case "ad": case "ads": case "advertisement": case "advertisements":
                let advertisements = "";
                for (const [key, val] of Object.entries(this.client.shopHandler.ads)) {
                    advertisements += `\n${key} Ad: $${val.cost} (${100 * (val.boost - 1)}% boost for ${this.formatDate(val.duration)})\n    To buy: \`${message.settings.prefix}store buy ${val.id}\``;
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle("Store - Advertisements")
                    .setDescription("The advertisements that we offer at this time are:${advertisements}")
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();
                
                message.channel.send(embed);
                break;
            case "machine": case "machines":
                let machines = "";
                for (const [key, val] of Object.entries(this.client.shopHandler.machines)) {
                    machines += `\n${key} Machine: $${val.cost} (${100 * (val.boost - 1)}% boost)\n    To buy: \`${message.settings.prefix}store buy ${val.id}\``;
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle("Store - Machines")
                    .setDescription("The machines that we offer at this time are:${machines}")
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();
                
                message.channel.send(embed);
                break;
            case "flavor": case "flavors":
                let flavors = "";
                for (const [key, val] of Object.entries(this.client.shopHandler.flavors)) {
                    flavors += `\n${key.toProperCase()}: $${val.cost} (${100 * (val.boost - 1)}% boost)\n    To buy: \`${message.settings.prefix}store buy ${val.id}\``;
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle("Store - Flavors")
                    .setDescription("The flavors that we offer at this time are:${flavors}")
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();
                
                message.channel.send(embed);
                break;
            case "buy":
                
                break;
            default:
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.get('name'))
                    .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                    .setColor(0xFF0000)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();  
        }

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
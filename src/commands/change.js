const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class ChangeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "change",
            description: "Changes parts of your shop.",
            category: "Shop",
            usage: "change [flavor] [machine #] [newFlavor]",
            aliases: []
        });
    }

    async run(message, args) {
        const category = args[0] && args[0].toLowerCase() || undefined;

        const profile = await this.client.shopHandler.getProfile(message);

        let embed;

        switch(category) {
            case "flavor": case "flavors":
                if (!args[1] || !isNaN(parseInt(args[1]))) {
                    embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.get('name'))
                        .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                        .setColor(0xFF0000)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    return message.channel.send(embed);
                }

                if (!args[2]) {
                    embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.get('name'))
                        .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                        .setColor(0xFF0000)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    return message.channel.send(embed);
                }

                const machine = parseInt(args[1]);
                const newFlavor = args[2];

                if (!this.client.shopHandler.flavors[newFlavor.toLowerCase()]) {
                    embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.get('name'))
                        .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                        .setColor(0xFF0000)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    return message.channel.send(embed);
                }

                let machines = JSON.parse(profile.machineCapacity);

                if (!machines[JSON.stringify(machine)]) {
                    embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.get('name'))
                        .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                        .setColor(0xFF0000)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    return message.channel.send(embed);
                }

                machines[JSON.stringify(machine)]["flavor"] = newFlavor.toLowerCase();

                await this.client.shops.update({
                    machineCapacity: JSON.stringify(machines)
                }, {
                    where: {
                        userId: message.author.id
                    }
                })
                break;
            default:
                embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.get('name'))
                    .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                    .setColor(0xFF0000)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break
        }
    }
}
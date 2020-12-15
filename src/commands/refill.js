const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class RefillCommand extends Command {
    constructor(client) {
        super(client, {
            name: "refill",
            description: "Refills all of your ice cream",
            category: "Economy",
            usage: "refill"
        });
    }

    async run(message, args) {
        const profile = await this.client.shopHandler.getProfile(message);

        try {
            const parsedMachines = JSON.parse(profile.machineCapacity)
            let newMachines = {};
            for (let machine in parsedMachines) {
                newMachines[machine]["capacity"] = 100;
            }

            await this.client.shops.update({
                machineCapacity: JSON.stringify(newMachines),
                lastRefill: Date()
            }, {
                where: {
                    userId: message.author.id
                }
            });

            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription("Your machines have all been refilled to 100%!")
                .setColor(0x00FF00)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        } catch (e) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription(`Error while refilling:
                
                ${e}`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        }
    }
}
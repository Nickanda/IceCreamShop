const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class UpgradeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "upgrade",
            description: "Upgrade machines from one tier to the next.",
            category: "Shop",
            usage: "upgrade <machine #>",
            aliases: []
        });

        this.machines = [
            "Basic",
            "Regular",
            "Improved",
            "Advanced"
        ];
    }

    async run(message, args) {
        const machine = args[0] && args[0].toLowerCase() || undefined;

        const profile = await this.client.shopHandler.getProfile(message);

        let embed;

        if (!args[0] || isNaN(parseInt(args[0]))) {
            embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.name)
                .setDescription(`Please follow the proper command format and include a machine number:\n\n\`${message.settings.prefix}upgrade <machine #>\``)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            return message.channel.send(embed);
        }

        let machines = JSON.parse(profile.machineCapacity);

        if (!machines[machine]) {
            embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.name)
                .setDescription(`You do not own a machine #${machine}.`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            return message.channel.send(embed);
        }

        if (machines[machine]["type"] == "Advanced") {
            embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.name)
                .setDescription(`You cannot upgrade past Advanced Machine at this time.`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            return message.channel.send(embed);
        }

        const costDifference = (this.client.shopHandler.machines[this.machines[parseInt(machine)]]["cost"] - this.client.shopHandler.machines[machines[machine]["type"]]["cost"]) * 1.05;

        embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(profile.name)
            .setDescription(`The upgrade cost from ${machines[machine]["type"]} to ${this.machines[parseInt(machine)]} will cost $${costDifference}.
                
Please type \`yes\` or \`no\`.`)
            .setColor(0xFFFF00)
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();

        const response = await this.client.awaitReply(message, embed);

        switch (response.toLowerCase()) {
            case "yes": case "y":
                if (profile.money < costDifference) {
                    embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.name)
                        .setDescription(`You do not have enough money to upgrade this machine. Required amount: $${costDifference}`)
                        .setColor(0xFF0000)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    return message.channel.send(embed);
                }

                machines[machine]["type"] = this.machines[parseInt(machine)];
                machines[machine]["capacity"] = 100;

                await this.client.shops.updateOne({
                    userId: message.author.id
                }, {
                    $inc: {
                        money: -1 * costDifference,
                        machineCapacity: JSON.stringify(machines)
                    }
                });

                embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.name)
                    .setDescription(`Machine #${machine} has successfully been upgraded to the ${this.client.shopHandler.machines[machines[machine]["type"]]}!`)
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break;
            case "no": case "n": case "cancel":
                embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.name)
                    .setDescription(`Prompt cancelled.`)
                    .setColor(0xFF0000)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break;
            default:
                embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.name)
                    .setDescription(`Invalid response. Please run the command and try again.`)
                    .setColor(0xFF0000)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break;
        }
    }
}
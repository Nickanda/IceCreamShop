const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class ServeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "serve",
            description: "Serves all of the customers in your shop right now",
            category: "Economy",
            usage: "serve"
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
        const profile = await this.client.shopHandler.getProfile(message);
        const cooldown = await this.client.shopHandler.getCooldowns(message, "serve");

        try {
            if (!cooldown || Date.now() - Date.parse(cooldown.createdAt) > cooldown.duration) {
                let capacity = await this.client.shopHandler.refreshMachineCapacity(message);

                let enoughCapacity = false;
                for (let machine in capacity) {
                    if (capacity[machine] !== 0 && capacity[machine]["capacity"] - 5 > 0) {
                        enoughCapacity = machine;
                    }
                }

                if (enoughCapacity) {
                    capacity[enoughCapacity]["capacity"] -= 5;

                    await profile.update({
                        machineCapacity: JSON.stringify(capacity)
                    }, {
                        where: {
                            userId: message.author.id
                        }
                    });

                    await profile.increment("money", {
                        where: {
                            userId: message.author.id
                        },
                        by: 25
                    });

                    if (cooldown) await cooldown.destroy();

                    await this.client.cooldowns.create({
                        userId: message.author.id,
                        action: "serve",
                        duration: 10000
                    });

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.get('name'))
                        .setDescription(`You earned $25 for serving your customers.`)
                        .setColor(0x00FF00)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    message.channel.send(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.get('name'))
                        .setDescription(`Error while serving your customers:
                
                        Please refill your machines using the \`${message.settings.prefix}refill\` command!`)
                        .setColor(0xFF0000)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    message.channel.send(embed);
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.get('name'))
                    .setDescription(`Error while serving your customers:
                
                    Please wait ${this.formatDate(cooldown.duration - (Date.now() - Date.parse(cooldown.createdAt)))}.`)
                    .setColor(0xFF0000)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
            }
        } catch (e) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription(`Error while serving your customers:
                
                ${e}`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        }
    }
}
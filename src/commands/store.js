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
        const category = args[0] && args[0].toLowerCase() || undefined;

        const profile = await this.client.shopHandler.getProfile(message);

        let embed;

        switch (category) {
            case "ad": case "ads": case "advertisement": case "advertisements":
                let advertisements = "";
                for (const [key, val] of Object.entries(this.client.shopHandler.ads)) {
                    advertisements += `\n${key} Ad: $${val.cost} (${Math.round(100 * (val.boost - 1))}% boost for ${this.formatDate(val.duration)})\n\tTo buy: \`${message.settings.prefix}store buy ${val.id}\`\n`;
                }

                embed = new Discord.MessageEmbed()
                    .setTitle("Store - Advertisements")
                    .setDescription(`The advertisements that we offer at this time are:\n${advertisements}`)
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break;
            case "flavor": case "flavors":
                let flavors = "";
                for (const [key, val] of Object.entries(this.client.shopHandler.flavors)) {
                    flavors += `\n${key.toProperCase()}: $${val.cost} (${Math.round(100 * (val.boost - 1))}% boost)\n\tTo buy: \`${message.settings.prefix}store buy ${val.id}\`\n`;
                }

                embed = new Discord.MessageEmbed()
                    .setTitle("Store - Flavors")
                    .setDescription(`The flavors that we offer at this time are:\n${flavors}`)
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break;
            case "machine": case "machines":
                let machines = "";
                for (const [key, val] of Object.entries(this.client.shopHandler.machines)) {
                    machines += `\n${key} Machine: $${val.cost} (${Math.round(100 * (val.boost - 1))}% boost)\n\tTo buy: \`${message.settings.prefix}store buy ${val.id}\`\n`;
                }

                embed = new Discord.MessageEmbed()
                    .setTitle("Store - Machines")
                    .setDescription(`The machines that we offer at this time are:\n${machines}`)
                    .setColor(0x00FF00)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break;
            case "buy":
                const id = args[1];

                if (id) {
                    let selected;

                    switch (id.toLowerCase().substring(0, 1)) {
                        case "a":
                            selected = "";
                            for (const [key, val] of Object.entries(this.client.shopHandler.ads)) {
                                if (val.id.toLowerCase() == id.toLowerCase()) {
                                    selected = key;
                                }
                            }

                            if (selected !== "") {
                                if (profile.money > this.client.shopHandler.ads[selected].cost) {
                                    embed = new Discord.MessageEmbed()
                                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                        .setTitle(profile.name)
                                        .setDescription(`WIP`)
                                        .setColor(0x00FF00)
                                        .setFooter('i!help', this.client.user.displayAvatarURL())
                                        .setTimestamp();

                                    message.channel.send(embed);
                                } else {
                                    embed = new Discord.MessageEmbed()
                                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                        .setTitle(profile.name)
                                        .setDescription(`You do not have enough money to buy this item. Required amount: $${this.client.shopHandler.ads[selected].cost}`)
                                        .setColor(0xFF0000)
                                        .setFooter('i!help', this.client.user.displayAvatarURL())
                                        .setTimestamp();

                                    message.channel.send(embed);
                                }
                            } else {
                                embed = new Discord.MessageEmbed()
                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                    .setTitle(profile.name)
                                    .setDescription(`I cannot find the item that correlates to that ID right now. Please check the ID in the store command and try again.`)
                                    .setColor(0xFF0000)
                                    .setFooter('i!help', this.client.user.displayAvatarURL())
                                    .setTimestamp();

                                message.channel.send(embed);
                            }
                            break;
                        case "f":
                            selected = "";
                            for (const [key, val] of Object.entries(this.client.shopHandler.flavors)) {
                                if (val.id.toLowerCase() == id.toLowerCase()) {
                                    selected = key;
                                }
                            }

                            if (selected !== "") {
                                const profileFlavors = JSON.parse(profile.flavors);

                                if (!profileFlavors.includes(selected)) {
                                    if (profile.money > this.client.shopHandler.flavors[selected].cost) {
                                        profileFlavors.push(selected);

                                        await this.client.shops.updateOne({
                                            userId: message.author.id
                                        }, {
                                            $inc: {
                                                money: -1 * this.client.shopHandler.flavors[selected].cost
                                            },
                                            $set: {
                                                flavors: JSON.stringify(profileFlavors)
                                            }
                                        });

                                        embed = new Discord.MessageEmbed()
                                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                            .setTitle(profile.name)
                                            .setDescription(`${selected.toProperCase()} flavor has successfully been bought!`)
                                            .setColor(0x00FF00)
                                            .setFooter('i!help', this.client.user.displayAvatarURL())
                                            .setTimestamp();

                                        message.channel.send(embed);
                                    } else {
                                        embed = new Discord.MessageEmbed()
                                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                            .setTitle(profile.name)
                                            .setDescription(`You do not have enough money to buy this item. Required amount: $${this.client.shopHandler.flavors[selected].cost}`)
                                            .setColor(0xFF0000)
                                            .setFooter('i!help', this.client.user.displayAvatarURL())
                                            .setTimestamp();

                                        message.channel.send(embed);
                                    }
                                } else {
                                    embed = new Discord.MessageEmbed()
                                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                        .setTitle(profile.name)
                                        .setDescription(`You already own this flavor!`)
                                        .setColor(0xFF0000)
                                        .setFooter('i!help', this.client.user.displayAvatarURL())
                                        .setTimestamp();

                                    message.channel.send(embed);
                                }
                            } else {
                                embed = new Discord.MessageEmbed()
                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                    .setTitle(profile.name)
                                    .setDescription(`I cannot find the item that correlates to that ID right now. Please check the ID in the store command and try again.`)
                                    .setColor(0xFF0000)
                                    .setFooter('i!help', this.client.user.displayAvatarURL())
                                    .setTimestamp();

                                message.channel.send(embed);
                            }
                            break;
                        case "m":
                            selected = "";
                            for (const [key, val] of Object.entries(this.client.shopHandler.machines)) {
                                if (val.id.toLowerCase() == id.toLowerCase()) {
                                    selected = key;
                                }
                            }

                            if (selected !== "") {
                                if (profile.money > this.client.shopHandler.machines[selected].cost) {
                                    const profileMachines = JSON.parse(profile.machineCapacity);

                                    if (Object.keys(profileMachines).length < 5) {
                                        profileMachines[JSON.stringify(Object.keys(profileMachines).length + 1)] = {
                                            type: selected,
                                            capacity: 100,
                                            flavor: "vanilla"
                                        };

                                        await this.client.shops.updateOne({
                                            userId: message.author.id
                                        }, {
                                            $inc: {
                                                money: -1 * this.client.shopHandler.machines[selected].cost
                                            },
                                            $set: {
                                                machineCapacity: JSON.stringify(profileMachines)
                                            }
                                        });

                                        embed = new Discord.MessageEmbed()
                                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                            .setTitle(profile.name)
                                            .setDescription(`${selected.toProperCase()} Machine has successfully been bought!`)
                                            .setColor(0x00FF00)
                                            .setFooter('i!help', this.client.user.displayAvatarURL())
                                            .setTimestamp();

                                        message.channel.send(embed);
                                    } else {
                                        embed = new Discord.MessageEmbed()
                                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                            .setTitle(profile.name)
                                            .setDescription(`At this time you can only own up to 5 machines in your shop. This may be expanded in the future.`)
                                            .setColor(0xFF0000)
                                            .setFooter('i!help', this.client.user.displayAvatarURL())
                                            .setTimestamp();

                                        message.channel.send(embed);
                                    }
                                } else {
                                    embed = new Discord.MessageEmbed()
                                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                        .setTitle(profile.name)
                                        .setDescription(`You do not have enough money to buy this item. Required amount: $${this.client.shopHandler.machines[selected].cost}`)
                                        .setColor(0xFF0000)
                                        .setFooter('i!help', this.client.user.displayAvatarURL())
                                        .setTimestamp();

                                    message.channel.send(embed);
                                }
                            } else {
                                embed = new Discord.MessageEmbed()
                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                    .setTitle(profile.name)
                                    .setDescription(`I cannot find the item that correlates to that ID right now. Please check the ID in the store command and try again.`)
                                    .setColor(0xFF0000)
                                    .setFooter('i!help', this.client.user.displayAvatarURL())
                                    .setTimestamp();

                                message.channel.send(embed);
                            }
                            break;
                    }
                } else {
                    embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTitle(profile.name)
                        .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                        .setColor(0xFF0000)
                        .setFooter('i!help', this.client.user.displayAvatarURL())
                        .setTimestamp();

                    message.channel.send(embed);
                }
                break;
            default:
                embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle(profile.name)
                    .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}store <ads/flavors/machines/buy> [ID]\``)
                    .setColor(0xFF0000)
                    .setFooter('i!help', this.client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send(embed);
                break;
        }
    }
}

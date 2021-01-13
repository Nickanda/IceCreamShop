const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class NameCommand extends Command {
    constructor(client) {
        super(client, {
            name: "name",
            description: "Renames your shop",
            category: "Economy",
            usage: "name <new_name>"
        });
    }

    async run(message, args) {
        const profile = await this.client.shopHandler.getProfile(message);
        const name = args.join(" ");

        if (name.length < 30) {
            await this.client.shops.updateOne({
                userId: message.author.id
            }, {
                $set: {
                    name: name
                }
            });

            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.name)
                .setDescription(`Your shop name has successfully been updated to ${name}!`)
                .setColor(0x00FF00)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.name)
                .setDescription(`Please keep your new shop name under 30 characters!`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        }
    }
}
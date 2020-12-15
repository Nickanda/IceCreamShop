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
        const name = args.join(" ");

        if (name.length < 30) {
            await this.client.shops.update({
                name: name
            }, {
                where: {
                    userId: message.author.id
                }
            });

            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription(`Your shop name has successfully been updated to ${name}!`)
                .setColor(0x00FF00)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(profile.get('name'))
                .setDescription(`Please keep your new shop name under 30 characters!`)
                .setColor(0xFF0000)
                .setFooter('i!help', this.client.user.displayAvatarURL())
                .setTimestamp();

            message.channel.send(embed);
        }


    }
}
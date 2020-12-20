const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "leaderboard",
            description: "Shows the leaderboards based on the amount of money.",
            category: "Economy",
            usage: "leaderboard",
            aliases: ["leaderboards", "lb"]
        });
    }

    async run(message, args) {
        const profile = await this.client.shopHandler.getProfile(message);

        const leaderboards = await this.client.shops.findAll({
            order: [["money", "DESC"]],
            limit: 10
        });

        let lbInsert = "";
        leaderboards.forEach(async (shop, ind) => {
            const user = await this.client.users.fetch(shop.get("userId"));
            lbInsert += `\n${ind + 1}. ${user.tag} - $${shop.get("money")}`;
        })

        await this.client.wait(250);

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(profile.get('name'))
            .setDescription(`Top 10 Money Leaderboard: \n${lbInsert}`)
            .setColor(0x00FF00)
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();

        message.channel.send(embed);
    }
}
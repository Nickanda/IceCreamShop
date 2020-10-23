const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class BotStatsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "botstats",
            description: "Shows bot information",
            category: "System",
            usage: "botstats"
        });
    }

    async run(message, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Ice Cream Shop")
            .setThumbnail(this.client.author.displayAvatarURL())
            .addField("Developer", "NicholasY#4815", true)
            .addField("Support Link", "https://discord.gg/sXkpG2J", true)
            .addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
            .addField("Library", `Discord.JS v${Discord.version}`, true)
    }
}
const Discord = require('discord.js');
const got = require('got');

module.exports = class ReadyEvent {
    constructor(client) {
        this.client = client;
    }

    async run() {
        await this.client.wait(1000);

        // this.client.appInfo = await this.client.fetchApplication();
        // setInterval(async () => {
        //     this.client.appInfo = await this.client.fetchApplication();
        // }, 60000);

        // await this.client.settings.sync();
        // await this.client.shops.sync();
        // await this.client.cooldowns.sync();

        const defaultSetting = await this.client.settings.findOne({ guildId: "default" });
        if (!defaultSetting) {
            throw new Error("No default setting available in the settings database.")
        }

        this.client.user.setActivity(`${defaultSetting.prefix}help | ${this.client.guilds.cache.size} Servers`);

        this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.guilds.cache.size} servers.`, "ready");

        setInterval(async () => {
            this.client.user.setActivity(`${defaultSetting.prefix}help | ${this.client.guilds.cache.size} Servers`);

            this.client.dbl.postStats(this.client.guilds.cache.size);

            await got('https://discord.bots.gg/api/v1/bots/765627044687249439/stats', {
                method: "POST",
                json: {
                    guildCount: this.client.guilds.cache.size
                },
                headers: {
                    Authorization: this.client.config.votingKeys.botsgg
                }
            });

            await got('https://discordbotlist.com/api/v1/bots/765627044687249439/stats', {
                method: "POST",
                json: {
                    guilds: this.client.guilds.cache.size
                },
                headers: {
                    Authorization: this.client.config.votingKeys.discordbotlist
                }
            });
        }, 900000);

        const embed = new Discord.MessageEmbed()
            .setTitle("Bot Ready")
            .setColor(0x00FF00)
            .setFooter('i!help', this.client.user.displayAvatarURL())
            .setTimestamp();

        const statusChannel = await this.client.channels.fetch("798740320363085865");
        statusChannel.send(embed);
    }
};
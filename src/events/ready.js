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

        await this.client.settings.sync();
        await this.client.shops.sync();
        await this.client.cooldowns.sync();

        const defaultSetting = await this.client.settings.findOne({ where: { guildId: "default" } });
        if (!defaultSetting) {
            throw new Error("No default setting available in the settings database.")
        }

        this.client.user.setActivity(`${defaultSetting.get("prefix")}help | ${this.client.guilds.cache.size} Servers`);

        this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.guilds.cache.size} servers.`, "ready");
    }
};

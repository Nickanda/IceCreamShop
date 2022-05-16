const Discord = require('discord.js');
const got = require('got');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = class ReadyEvent {
  constructor(client) {
    this.client = client;
  }

  async run() {
    await this.client.wait(1000);

    const defaultSetting = await this.client.settings.findOne({ guildId: "default" });
    if (!defaultSetting) {
      throw new Error("No default setting available in the settings database.")
    }

    this.client.user.setActivity(`discord.gg/sXkpG2J | ${this.client.guilds.cache.size} Servers`);

    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.guilds.cache.size} servers.`, "ready");

    setInterval(async () => {
      this.client.user.setActivity(`discord.gg/sXkpG2J | ${this.client.guilds.cache.size} Servers`);

      // this.client.dbl.postStats(this.client.guilds.cache.size);

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
      .setFooter({
        text: '/help',
        iconURL: this.client.user.displayAvatarURL()
      })
      .setTimestamp();

    const statusChannel = await this.client.channels.fetch("798740320363085865");
    statusChannel.send({ embeds: [embed] });

    if (!this.client.application?.owner) await this.client.application?.fetch();

    let commandInfo = [];

    const commands = this.client.commands.map(val => val);

    commands.forEach(command => {
      commandInfo.push({
        name: command.help.name,
        description: command.help.description,
        options: command.help.options,
        defaultPermission: command.conf.permissions.length == 0
      });
    });

    setTimeout(() => { }, 250);

    const rest = new REST({ version: '9' }).setToken(this.client.config.discordToken);

    (async () => {
      try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
          Routes.applicationGuildCommands(this.client.user.id),
          { body: commandInfo },
        );

        await rest.put(
          Routes.applicationGuildCommands(this.client.user.id, "768580865449787404"),
          { body: [] },
        );

        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
    })();
  }
};
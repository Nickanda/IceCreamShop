const { AutoPoster } = require('topgg-autoposter');
const { Client, Collection } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const topgg = require("@top-gg/sdk");

const Logger = require('./Logger');
const ShopHandler = require('./ShopHandler');

module.exports = class DiscordClient extends Client {
  constructor(options) {
    super(options);

    this.config = require(path.join(process.cwd(), './config.json'));

    this.commands = new Collection();
    this.aliases = new Collection();

    this.topgg = new topgg.Webhook(this.config.votingKeys.topggwebhook);

    this.autoposter = new AutoPoster(this.config.votingKeys.topgg, this);

    this.databaseClient = new MongoClient(`mongodb://${this.config.database.username}:${this.config.database.password}localhost:27017`, { useNewUrlParser: true });

    this.botStaff = {
      developers: ["190966781760765952"],
      administrators: [],
      support: []
    };

    this.logger = new Logger();
    this.shopHandler = new ShopHandler(this);
    this.wait = require("util").promisify(setTimeout);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}/${commandName}`))(this);
      this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      console.log(e)
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  async clean(text) {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(this.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  }

  async getSettings(guild) {
    const settings = await this.settings.findOne({ "guildId": "default" });
    return settings;
    // if (!guild) return await this.settings.findOne({"guildId": "default"});
    // const [settings, created] = await this.settings.findOrCreate({ where: { guildId: guild.id } })
    // return settings;
  }

  async awaitReply(msg, question, limit = 60000) {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  }
}
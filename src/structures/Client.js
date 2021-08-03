const { AutoPoster } = require('topgg-autoposter');
const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');
const mongooseFindOrCreate = require('mongoose-findorcreate');
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

    this.database = mongoose;
    this.database.plugin(mongooseFindOrCreate);
    this.database.Promise = Promise;

    this.cooldowns = mongoose.model('cooldowns', new mongoose.Schema({
      userId: String,
      action: String,
      duration: Number,
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }));

    this.settings = mongoose.model('settings', new mongoose.Schema({
      guildId: String,
      prefix: {
        type: String,
        default: 'i!'
      },
      premiumServer: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }));

    this.shops = mongoose.model('shops', new mongoose.Schema({
      userId: String,
      name: {
        type: String,
        default: 'Ice Cream Shop'
      },
      money: {
        type: Number,
        default: 1000
      },
      customerMax: {
        type: Number,
        default: 10
      },
      machineCapacity: {
        type: Array,
        default: [{
          type: "Basic", 
          capacity: 100, 
          flavor: "vanilla"
        }]
      },
      lastRefill: {
        type: Date,
        default: Date.now()
      },
      flavors: {
        type: Array,
        default: ["vanilla"]
      },
      advertisements: {
        type: Array,
        default: []
      },
      dailyStreak: {
        type: Number,
        default: 0
      },
      premiumExpiration: Date,
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }));

    this.votes = mongoose.model('votes', new mongoose.Schema({
      userId: String,
      claimed: Boolean,
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }));

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
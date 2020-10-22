const { Client, Collection } = require('discord.js');
const Sequelize = require('sequelize');

module.exports = class DiscordClient extends Client {
    constructor(options) {
        super(options);

        this.config = require("../../config.json");

        this.commands = new Collection();
        this.aliases = new Collection();

        this.database = new Sequelize('iceCreamShop', this.config.database.username, this.config.database.password, {
            host: 'localhost',
            dialect: 'mysql',
            logging: false
        });

        this.settings = this.database.define('settings', {
            guildId: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            prefix: {
                type: Sequelize.STRING,
                defaultValue: 'i!'
            },
            premiumBoost: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });

        this.shops = this.database.define('shops', {
            userId: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                defaultValue: 'Ice Cream Shop'
            },
            money: {
                type: Sequelize.INTEGER,
                defaultValue: 1000
            }
        });

        this.botStaff = {
            developers: ["190966781760765952", "386572401141481482"],
            administrators: [],
            support: []
        };

        //requiring the Logger class for easy console logging
        this.logger = require("./Logger");

        // Basically just an async shortcut to using a setTimeout. Nothing fancy!
        this.wait = require("util").promisify(setTimeout);
    }

    /* 
    COMMAND LOAD AND UNLOAD
    
    To simplify the loading and unloading of commands from multiple locations
    including the index.js load loop, and the reload function, these 2 ensure
    that unloading happens in a consistent manner across the board.
    */

    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
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

    /*
    MESSAGE CLEAN FUNCTION
    "Clean" removes @everyone pings, as well as tokens, and makes code blocks
    escaped so they're shown more easily. As a bonus it resolves promises
    and stringifies objects!
    This is mostly only used by the Eval and Exec commands.
    */
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

    /* SETTINGS FUNCTIONS
    These functions are used by any and all location in the bot that wants to either
    read the current *complete* guild settings (default + overrides, merged) or that
    wants to change settings for a specific guild.
    */

    // getSettings merges the client defaults with the guild settings. guild settings in
    // enmap should only have *unique* overrides that are different from defaults.
    getSettings(guild) {
        if (guild) {
            const [settings, created] = await client.settings.findOrCreate( { where: { guildId: guild.id } } )
            return (settings);
        } else {
            const settings = {}
            return (settings);
        }
    }

    // writeSettings overrides, or adds, any configuration item that is different
    // than the defaults. This ensures less storage wasted and to detect overrides.
    writeSettings(id, newSettings) {
        const defaults = this.settings.get("default");
        let settings = this.settings.get(id);
        if (typeof settings != "object") settings = {};
        for (const key in newSettings) {
            if (defaults[key] !== newSettings[key]) {
                settings[key] = newSettings[key];
            } else {
                delete settings[key];
            }
        }
        this.settings.set(id, settings);
    }

    /*
    SINGLE-LINE AWAITMESSAGE
    A simple way to grab a single reply, from the user that initiated
    the command. Useful to get "precisions" on certain things...
    USAGE
    const response = await client.awaitReply(msg, "Favourite Color?");
    msg.reply(`Oh, I really love ${response} too!`);
    */
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
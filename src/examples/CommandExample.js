const Command = require("../base/Command.js");

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "example",
            description: "Example.",
            usage: "example",
            aliases: ["ex"],
            category: "Miscellaneous",
            enabled: true,
            guildOnly: false,
            aliases: []
        });
    }

    async run(message, args) {

    }
}
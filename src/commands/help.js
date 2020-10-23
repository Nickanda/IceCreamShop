const Command = require('../structures/Command');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Displays all the available commands for you.",
            category: "System",
            usage: "help [command]",
            aliases: ["h"]
        });
    }

    async run(message, args, level) {
        if (!args[0]) {
            const settings = message.settings;

            const myCommands = message.guild ? this.client.commands : this.client.commands.filter(cmd => cmd.conf.guildOnly !== true);
            const commandNames = myCommands.keyArray();
            const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
            let currentCategory = "";
            let output = `= Command List =\n\n[Use ${settings.get("prefix")}help <commandname> for details]\n`;
            const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
            sorted.forEach(c => {
                const cat = c.help.category.toProperCase();
                if (currentCategory !== cat) {
                    output += `\u200b\n== ${cat} ==\n`;
                    currentCategory = cat;
                }
                output += `${settings.get("prefix")}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
            });
            message.channel.send(output, { code: "asciidoc", split: { char: "\u200b" } });
        } else {
            let command = args[0];
            if (this.client.commands.has(command)) {
                command = this.client.commands.get(command);
                // if (level < this.client.levelCache[command.conf.permLevel]) return;
                message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\nalises:: ${command.conf.aliases.join(", ")}`, { code: "asciidoc" });
            }
        }
    }
}
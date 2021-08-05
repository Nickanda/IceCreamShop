const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Displays all the available commands for you.",
      category: "System",
      usage: "help [command]",
      options: [
        {
          type: "STRING",
          name: "command",
          description: "The name of the command that you want more information about"
        }
      ]
    });
  }

  async run(message, args, level) {
    if (!args[0]) {
      const settings = message.settings;

      const myCommands = message.guild ? this.client.commands : this.client.commands.filter(cmd => {
        (cmd.permLevel == "developers" ? this.client.botStaff.developers.includes(message.author?.id ?? message.user?.id) : true)
          && (cmd.permLevel == "administrators" ? this.client.botStaff.administrators.includes(message.author?.id ?? message.user?.id) : true)
          && (cmd.permLevel == "support" ? this.client.botStaff.support.includes(message.author?.id ?? message.user?.id) : true)
      });

      const commandNames = myCommands.map(command => command.help.name);
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

      let currentCategory = '';
      let output = '```asciidoc\n';
      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);

      let embed = new Discord.MessageEmbed()
        .setTitle('Command List')
        .setDescription(`Use \`${settings.prefix}help <commandname>\` for details`)
        .setFooter('Made with love by NicholasY#4815');
      sorted.forEach((c, index) => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat || index + 1 == sorted.length) {
          output += '\n```';
          if (currentCategory.length > 0) embed.addField(currentCategory, output);
          currentCategory = cat;
          output = '```asciidoc\n';
        };
        output += `${msg.settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
      });
      msg.channel.send({ embeds: [embed] });
    } else {
      let command = args[0];
      if (client.commands.has(command)) {
        command = client.commands.get(command);
        if (cmd.permLevel && (cmd.permLevel == "developers" ? this.client.botStaff.developers.includes(message.author?.id ?? message.user?.id) : true)
        && (cmd.permLevel == "administrators" ? this.client.botStaff.administrators.includes(message.author?.id ?? message.user?.id) : true)
        && (cmd.permLevel == "support" ? this.client.botStaff.support.includes(message.author?.id ?? message.user?.id) : true)) {
          msg.channel.send(Discord.Formatters.codeBlock("ascii", `= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(', ')}\n= ${command.help.name} =`));
        } else {

        }        
      };
    }
  }
}
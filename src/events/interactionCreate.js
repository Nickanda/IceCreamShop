const Discord = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(interaction) {
    if (interaction.isCommand()) {
      if (interaction.guild && !interaction.channel.permissionsFor(interaction.guild.me).missing(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;

      const settings = await this.client.getSettings(interaction.guild);

      interaction.settings = settings;

      // const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);

      if (interaction.guild && !interaction.member) await interaction.guild.members.fetch(message.member);

      const cmd = this.client.commands.get(interaction.commandName);
      if (!cmd) return;

      let args = []
      cmd.help.options.forEach(option => {
        if (option.type == "SUB_COMMAND") {
          const interactionOptions = interaction.options.getSubcommand(true);

          if (interactionOptions == option.name) {
            args.push(interactionOptions);
            if (option.options) {
              option.options.forEach(option => {
                const interactionOptions = interaction.options.get(option.name, option.required ?? false);

                if (interactionOptions && option.required) {
                  switch (interactionOptions.type) {
                    case "STRING": case "INTEGER": case "BOOLEAN": case "NUMBER":
                      args.push(interactionOptions.value);
                      break;
                    case "USER":
                      args.push(interactionOptions.user);
                      break;
                    case "CHANNEL":
                      args.push(interactionOptions.channel);
                      break;
                    case "ROLE":
                      args.push(interactionOptions.role);
                      break;
                    default:
                      break;
                  }
                }
              });
            }
          }
        } else {
          const interactionOptions = interaction.options.get(option.name, option.required ?? false);

          if (interactionOptions && option.required) {
            switch (interactionOptions.type) {
              case "STRING": case "INTEGER": case "BOOLEAN": case "NUMBER":
                args.push(interactionOptions.value);
                break;
              case "USER":
                args.push(interactionOptions.user);
                break;
              case "CHANNEL":
                args.push(interactionOptions.channel);
                break;
              case "ROLE":
                args.push(interactionOptions.role);
                break;
              default:
                break;
            }
          }
        }
      });

      if (cmd.conf.permLevel !== "") {
        if (!this.client.botStaff[cmd.conf.permLevel].includes(interaction.member.id)) return interaction.reply('You do not have permission to use this command.');
      }

      this.client.logger.log(`${interaction.member.user.username} (${interaction.member.id}) ran command ${cmd.help.name}`, "cmd");

      try {
        cmd.run(interaction, args);
      } catch (e) {
        message.reply(e);
      }
    }

  }
};
const Discord = require('discord.js');

module.exports = class InteractionCreateEvent {
  constructor(client) {
    this.client = client;
  }

  filterCommands(array, options) {
    switch (options.type) {
      case "STRING": case "INTEGER": case "BOOLEAN": case "NUMBER":
        array.push(options.value);
        break;
      case "USER":
        array.push(options.user);
        break;
      case "CHANNEL":
        array.push(options.channel);
        break;
      case "ROLE":
        array.push(options.role);
        break;
      default:
        break;
    }
  }

  async run(interaction) {
    if (interaction.isCommand()) {
      if (interaction.guild && !interaction.channel.permissionsFor(interaction.guild.me).missing(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;

      const settings = await this.client.getSettings(interaction.guild);

      interaction.settings = settings;

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
                  this.filterCommands(args, interactionOptions);
                }
              });
            }
          }
        } else {
          const interactionOptions = interaction.options.get(option.name, option.required ?? false);

          if (interactionOptions && option.required) {
            this.filterCommands(args, interactionOptions);
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
    } else if (interaction.isButton()) {

    }
  }
};
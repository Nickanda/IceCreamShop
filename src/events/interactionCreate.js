const Discord = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(interaction) {
    if (interaction.isCommand()) {
      console.log(interaction);
      if (interaction.guild && !interaction.channel.permissionsFor(interaction.guild.me).missing(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;

      const settings = await this.client.getSettings(interaction.guild);

      interaction.settings = settings;

      // const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);

      if (interaction.guild && !interaction.member) await interaction.guild.members.fetch(message.member);

      const cmd = this.client.commands.get(interaction.commandName);
      if (!cmd) return;

      let args = []
      cmd.help.options.forEach(option => {
        const interactionOptions = interaction.options.get(option.name, option.required ?? false);

        switch(interactionOptions.type) {
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
          case "SUB_COMMAND":
            args.push(option.name);
            break;
          case "SUB_COMMAND_GROUP":
            break;
        }
      });

      if (cmd.conf.permLevel !== "") {
        if (!this.client.botStaff[cmd.conf.permLevel].includes(interaction.member.id)) return interaction.reply('You do not have permission to use this command.');
      }

      this.client.logger.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");

      try {
        cmd.run(interaction, args);
      } catch (e) {
        message.reply(e);
      }
    }

  }
};
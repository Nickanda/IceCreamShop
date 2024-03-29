const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class MachinesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "machines",
      description: "Shows the machines that you currently have",
      category: "Shop",
      usage: "machines"
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);
    const capacity = await this.client.shopHandler.refreshMachineCapacity(message);

    let machineCap = "";
    capacity.forEach((machine, index) => {
      machineCap += `\n${machine.type} Machine ${index + 1} (${machine.flavor}): ${machine.capacity}%`;
    });

    const embed = new Discord.MessageEmbed()
      .setAuthor({
        name: message.author?.tag ?? message.user?.tag,
        iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
      })
      .setTitle(profile.name)
      .setDescription(`Your machines:${machineCap}`)
      .setColor(0x00FF00)
      .setFooter({
        text: '/help',
        iconURL: this.client.user.displayAvatarURL()
      })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
}
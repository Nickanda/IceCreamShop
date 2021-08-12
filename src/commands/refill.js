const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class RefillCommand extends Command {
  constructor(client) {
    super(client, {
      name: "refill",
      description: "Refills all of your ice cream",
      category: "Shop",
      usage: "refill"
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);

    try {
      let newMachines = [];
      profile.machineCapacity.forEach((machine, index) => {
        newMachines[index] = {
          type: machine["type"],
          capacity: 100,
          flavor: machine["flavor"]
        };
      })

      await this.client.wait(50);

      await this.client.shops.updateOne({
        userId: message.author?.id ?? message.user?.id
      }, {
        $set: {
          machineCapacity: newMachines,
          lastRefill: Date()
        }
      });

      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author?.tag ?? message.user?.tag, message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription("Your machines have all been refilled to 100%!")
        .setColor(0x00FF00)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (e) {
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author?.tag ?? message.user?.tag, message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Error while refilling:
                
${e}`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  }
}
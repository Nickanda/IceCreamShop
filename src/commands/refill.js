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
      const parsedMachines = profile.machineCapacity;
      let newMachines = {};
      for (let machine in parsedMachines) {
        newMachines[machine] = {
          type: parsedMachines[machine]["type"],
          capacity: 100,
          flavor: parsedMachines[machine]["flavor"]
        };
      }

      await this.client.wait(50);

      await this.client.shops.updateOne({
        userId: message.author.id
      }, {
        $set: {
          machineCapacity: newMachines,
          lastRefill: Date()
        }
      });

      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription("Your machines have all been refilled to 100%!")
        .setColor(0x00FF00)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Error while refilling:
                
${e}`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    }
  }
}
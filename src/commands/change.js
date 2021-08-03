const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class ChangeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "change",
      description: "Changes parts of your shop.",
      category: "Shop",
      usage: "change <machine #> <newFlavor>",
      aliases: []
    });
  }

  async run(message, args) {
    // const category = args[0] && args[0].toLowerCase() || undefined;

    const profile = await this.client.shopHandler.getProfile(message);

    let embed;

    // switch(category) {
    //     case "flavor": case "flavors":
    if (!args[0] || isNaN(parseInt(args[0]))) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a machine number:\n\n\`${message.settings.prefix}change <machine #> <newFlavor>\``)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    }

    if (!args[1]) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a new flavor:\n\n\`${message.settings.prefix}change <machine #> <newFlavor>\``)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    }

    const machine = parseInt(args[0]);
    const newFlavor = args[1].toLowerCase();

    if (!this.client.shopHandler.flavors[newFlavor.toLowerCase()]) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a valid flavor:\n\n\`${message.settings.prefix}change <machine #> <newFlavor>\``)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    }

    const flavors = profile.flavors;
    let machines = profile.machineCapacity;

    if (!machines[JSON.stringify(machine)]) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`You do not own a machine #${machine}.`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    }

    if (!flavors.includes(newFlavor)) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`You don't have the ${newFlavor} flavor!`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(embed);
    }

    machines[JSON.stringify(machine)]["flavor"] = newFlavor;

    await this.client.shops.updateOne({
      userId: message.author.id
    }, {
      $set: {
        machineCapacity: machines
      }
    });

    embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(profile.name)
      .setDescription(`Machine #${machine} has successfully been changed to the ${newFlavor} flavor!`)
      .setColor(0x00FF00)
      .setFooter('i!help', this.client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send(embed);
    // break;
    // default:
    //     embed = new Discord.MessageEmbed()
    //         .setAuthor(message.author.tag, message.author.displayAvatarURL())
    //         .setTitle(profile.name)
    //         .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`${message.settings.prefix}change <flavor> <machine #> <newFlavor>\``)
    //         .setColor(0xFF0000)
    //         .setFooter('i!help', this.client.user.displayAvatarURL())
    //         .setTimestamp();

    //     message.channel.send(embed);
    //     break
    // }
  }
}
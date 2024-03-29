const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class ChangeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "change",
      description: "Changes parts of your shop.",
      category: "Shop",
      usage: "change <machine #> <newFlavor>",
      options: [
        {
          type: "INTEGER",
          name: "machine_number",
          description: "The number of the machine that you want to change",
          required: true
        },
        {
          type: "STRING",
          name: "new_flavor",
          description: "The new flavor that you want your machine to use",
          required: true
        }
      ]
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
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a machine number:\n\n\`/change <machine #> <newFlavor>\``)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    if (!args[1]) {
      embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a new flavor:\n\n\`/change <machine #> <newFlavor>\``)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    const machine = parseInt(args[0]) - 1;
    const newFlavor = args[1].toLowerCase();

    if (!this.client.shopHandler.flavors[newFlavor.toLowerCase()]) {
      embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a valid flavor:\n\n\`/change <machine #> <newFlavor>\``)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    const flavors = profile.flavors;
    let machines = profile.machineCapacity;

    if (!machines[machine]) {
      embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`You do not own a machine #${machine + 1}.`)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    if (!flavors.includes(newFlavor)) {
      embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`You don't have the ${newFlavor} flavor!`)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    machines[machine]["flavor"] = newFlavor;

    await this.client.shops.updateOne({
      userId: message.author?.id ?? message.user?.id
    }, {
      $set: {
        machineCapacity: machines
      }
    });

    embed = new Discord.MessageEmbed()
      .setAuthor({
        name: message.author?.tag ?? message.user?.tag,
        iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
      })
      .setTitle(profile.name)
      .setDescription(`Machine #${machine + 1} has successfully been changed to the ${newFlavor} flavor!`)
      .setColor(0x00FF00)
      .setFooter({
        text: '/help',
        iconURL: this.client.user.displayAvatarURL()
      })
      .setTimestamp();

    message.reply({ embeds: [embed] });
    // break;
    // default:
    //     embed = new Discord.MessageEmbed()
    //         .setAuthor({
  //   name: message.author?.tag ?? message.user?.tag,
  //     iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
  // })
  //         .setTitle(profile.name)
  //         .setDescription(`That is currently not a valid choice. Please follow the proper command format:\n\n\`/change <flavor> <machine #> <newFlavor>\``)
  //         .setColor(0xFF0000)
  //         .setFooter({
//   text: '/help',
//   iconURL: this.client.user.displayAvatarURL()
// })
    //         .setTimestamp();

    //     message.reply({embeds: [embed]});
    //     break
    // }
  }
}
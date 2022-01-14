const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class UpgradeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "upgrade",
      description: "Upgrade machines from one tier to the next.",
      category: "Shop",
      usage: "upgrade <machine #>",
      options: [
        {
          type: "INTEGER",
          name: "machine_number",
          description: "The number of the machine that you want to upgrade",
          required: true
        }
      ]
    });

    this.machines = [
      "Basic",
      "Regular",
      "Improved",
      "Advanced"
    ];
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);

    let embed;

    if (!args[0] || isNaN(parseInt(args[0]))) {
      embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a machine number:\n\n\`${message.settings.prefix}upgrade <machine #>\``)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    const machine = parseInt(args[0]) - 1;
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

    if (machines[machine]["type"] == "Advanced") {
      embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`You cannot upgrade past Advanced Machine at this time.`)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    const costDifference = (this.client.shopHandler.machines[this.machines[machine + 1]]["cost"] - this.client.shopHandler.machines[machines[machine]["type"]]["cost"]) * 1.05;

    embed = new Discord.MessageEmbed()
      .setAuthor({
        name: message.author?.tag ?? message.user?.tag,
        iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
      })
      .setTitle(profile.name)
      .setDescription(`The upgrade cost from ${machines[machine]["type"]} to ${this.machines[machine + 1]} will cost $${costDifference}.
                
Please type \`yes\` or \`no\`.`)
      .setColor(0xFFFF00)
      .setFooter({
        text: '/help',
        iconURL: this.client.user.displayAvatarURL()
      })
      .setTimestamp();

    const response = await this.client.awaitReply(message, { embeds: [embed] });

    switch (response.toLowerCase()) {
      case "yes": case "y":
        if (profile.money < costDifference) {
          embed = new Discord.MessageEmbed()
            .setAuthor({
              name: message.author?.tag ?? message.user?.tag,
              iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
            })
            .setTitle(profile.name)
            .setDescription(`You do not have enough money to upgrade this machine. Required amount: $${costDifference}`)
            .setColor(0xFF0000)
            .setFooter({
              text: '/help',
              iconURL: this.client.user.displayAvatarURL()
            })
            .setTimestamp();

          return message.reply({ embeds: [embed] });
        }

        machines[machine]["type"] = this.machines[machine + 1];
        machines[machine]["capacity"] = 100;

        await this.client.shops.updateOne({
          userId: message.author?.id ?? message.user?.id
        }, {
          $inc: {
            money: -1 * costDifference
          },
          machineCapacity: machines
        });

        embed = new Discord.MessageEmbed()
          .setAuthor({
            name: message.author?.tag ?? message.user?.tag,
            iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
          })
          .setTitle(profile.name)
          .setDescription(`Machine #${machine + 1} has successfully been upgraded to the ${this.client.shopHandler.machines[machines[machine]["type"]]}!`)
          .setColor(0x00FF00)
          .setFooter({
            text: '/help',
            iconURL: this.client.user.displayAvatarURL()
          })
          .setTimestamp();

        message.reply({ embeds: [embed] });
        break;
      case "no": case "n": case "cancel":
        embed = new Discord.MessageEmbed()
          .setAuthor({
            name: message.author?.tag ?? message.user?.tag,
            iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
          })
          .setTitle(profile.name)
          .setDescription(`Prompt cancelled.`)
          .setColor(0xFF0000)
          .setFooter({
            text: '/help',
            iconURL: this.client.user.displayAvatarURL()
          })
          .setTimestamp();

        message.reply({ embeds: [embed] });
        break;
      default:
        embed = new Discord.MessageEmbed()
          .setAuthor({
            name: message.author?.tag ?? message.user?.tag,
            iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
          })
          .setTitle(profile.name)
          .setDescription(`Invalid response. Please run the command and try again.`)
          .setColor(0xFF0000)
          .setFooter({
            text: '/help',
            iconURL: this.client.user.displayAvatarURL()
          })
          .setTimestamp();

        message.reply({ embeds: [embed] });
        break;
    }
  }
}
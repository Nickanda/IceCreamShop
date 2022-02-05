const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class ServeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "serve",
      description: "Serves all of the customers in your shop right now",
      category: "Economy",
      usage: "serve"
    });
  }

  formatDate(milliseconds) {
    milliseconds = Math.floor(milliseconds / 1000);
    const seconds = milliseconds % 60;
    milliseconds /= 60;
    const minutes = Math.floor(milliseconds % 60);
    milliseconds /= 60;
    const hours = Math.floor(milliseconds % 24);

    return `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${seconds > 0 ? seconds + " seconds" : ""}`;
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);
    const cooldown = await this.client.shopHandler.getCooldowns(message, "serve");

    try {
      if (!cooldown || Date.now() - Date.parse(cooldown.createdAt) > cooldown.duration) {
        let capacity = await this.client.shopHandler.refreshMachineCapacity(message);

        let enoughCapacity = false;
        for (let machine in capacity) {
          if (capacity[machine] !== 0 && capacity[machine]["capacity"] - 5 > 0) {
            enoughCapacity = machine;
          }
        }

        if (enoughCapacity) {
          capacity[enoughCapacity]["capacity"] -= 5;

          await this.client.shops.updateOne({
            userId: message.author?.id ?? message.user?.id
          }, {
            $set: {
              machineCapacity: capacity,
            }
          });

          const boost = await this.client.shopHandler.calculateBoosts(profile.advertisements, profile.machineCapacity);
          const median = Math.floor(20 * boost);
          const addAmount = Math.floor(Math.random() * ((median + 5) - (median - 15)) + (median - 15));

          await this.client.shops.updateOne({
            userId: message.author?.id ?? message.user?.id
          }, {
            $inc: {
              money: addAmount
            }
          });

          if (cooldown) await this.client.cooldowns.deleteMany({
            userId: message.author?.id ?? message.user?.id,
            action: "serve"
          });

          await this.client.cooldowns.create({
            userId: message.author?.id ?? message.user?.id,
            action: "serve",
            duration: 10000,
            createdAt: Date()
          });

          const embed = new Discord.MessageEmbed()
            .setAuthor({
              name: message.author?.tag ?? message.user?.tag,
              iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
            })
            .setTitle(profile.name)
            .setDescription(`You earned $${addAmount} for serving your customers.`)
            .setColor(0x00FF00)
            .setFooter({
              text: '/help',
              iconURL: this.client.user.displayAvatarURL()
            })
            .setTimestamp();

          const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
              .setCustomId("serve")
              .setLabel("Serve Customers")
              .setStyle("PRIMARY")
          );

          message.reply({ embeds: [embed], components: [row] });
        } else {
          const embed = new Discord.MessageEmbed()
            .setAuthor({
              name: message.author?.tag ?? message.user?.tag,
              iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
            })
            .setTitle(profile.name)
            .setDescription(`Error while serving your customers:
                
Please refill your machines using the \`/refill\` command!`)
            .setColor(0xFF0000)
            .setFooter({
              text: '/help',
              iconURL: this.client.user.displayAvatarURL()
            })
            .setTimestamp();

          message.reply({ embeds: [embed] });
        }
      } else {
        const embed = new Discord.MessageEmbed()
          .setAuthor({
            name: message.author?.tag ?? message.user?.tag,
            iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
          })
          .setTitle(profile.name)
          .setDescription(`Error while serving your customers:
                
Please wait ${this.formatDate(cooldown.duration - (Date.now() - Date.parse(cooldown.createdAt)))}.`)
          .setColor(0xFF0000)
          .setFooter({
            text: '/help',
            iconURL: this.client.user.displayAvatarURL()
          })
          .setTimestamp();

        message.reply({ embeds: [embed] });
      }
    } catch (e) {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author?.tag ?? message.user?.tag,
          iconURL: message.author?.displayAvatarURL() ?? message.user?.displayAvatarURL()
        })
        .setTitle(profile.name)
        .setDescription(`Error while serving your customers:
                
${e}`)
        .setColor(0xFF0000)
        .setFooter({
          text: '/help',
          iconURL: this.client.user.displayAvatarURL()
        })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  }
}
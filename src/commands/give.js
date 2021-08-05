const Discord = require('discord.js');

const Command = require('../structures/Command');

module.exports = class GiveCommand extends Command {
  constructor(client) {
    super(client, {
      name: "give",
      description: "Donates a certain amount of money to another user (there is a 10% tax!).",
      category: "Shop",
      usage: "give <@user> <amount>",
      options: [
        {
          type: "USER",
          name: "user",
          description: "The user who you want to donate money to",
          required: true
        },
        {
          type: "INTEGER",
          name: "amount",
          description: "The amount of money you want to give to another user",
          required: true
        }
      ]
    });
  }

  async run(message, args) {
    const profile = await this.client.shopHandler.getProfile(message);

    if (!args[0]) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include a user:\n\n\`${message.settings.prefix}give <@user> <amount>\``)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    if (!args[1] || isNaN(parseInt(args[1]))) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format and include an amount to donate:\n\n\`${message.settings.prefix}give <@user> <amount>\``)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    const userId = args[0] ? args[0].match(/\d+/g) : undefined;
    const amount = args[1] ? (isNaN(parseInt(args[1])) ? undefined : parseInt(args[1])) : undefined;

    if (!userId || !amount) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Please follow the proper command format:\n\n\`${message.settings.prefix}give <@user> <amount>\``)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    if (profile.money < amount) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`You do not have the sufficient money to donate $${amount}! You currently have $${profile.money}.`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    const targetUser = await this.client.users.fetch(userId, false);

    if (!targetUser) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`It does not seem like the target user is a valid user.`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    const targetProfile = await this.client.shops.findOne({
      userId: userId
    });

    if (!targetProfile) {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`It does not seem like the target user has a profile with Ice Cream Shop right now!`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    const confirmationCode = Math.floor(Math.random() * (10000 - 1000) + 1000);

    const receiveAmount = Math.floor(amount * 0.9);

    embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(profile.name)
      .setDescription(`You are about to give ${targetUser.username} $${amount}. A 10% tax will be applied, so the user will receive ${receiveAmount}.
                
Please type \`${confirmationCode}\` to approve of this transaction.`)
      .setColor(0xFFFF00)
      .setFooter('i!help', this.client.user.displayAvatarURL())
      .setTimestamp();

    const response = await this.client.awaitReply(message, embed);

    if (response == confirmationCode) {
      await this.client.shops.updateOne({
        userId: message.author?.id ?? message.user?.id
      }, {
        $inc: {
          money: -1 * amount
        }
      });

      await this.client.shops.updateOne({
        userId: userId
      }, {
        $inc: {
          money: receiveAmount
        }
      });

      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`$${receiveAmount} has successfully been donated to ${targetUser.username}`)
        .setColor(0x00FF00)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } else {
      embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(profile.name)
        .setDescription(`Prompt cancelled`)
        .setColor(0xFF0000)
        .setFooter('i!help', this.client.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }
  }
}
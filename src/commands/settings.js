const Command = require('../structures/Command');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "settings",
      description: "Changes the server settings.",
      category: "System",
      usage: "settings",
      enabled: false
    });
  }

  async run(message, args) {
    const msg = await message.channel.send("🏓 Ping!");
    msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.client.ws.ping)}ms.)`);
  }
}
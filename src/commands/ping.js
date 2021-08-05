const Command = require('../structures/Command');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Latency and API response times.",
      category: "System",
      usage: "ping"
    });
  }

  async run(message, args) {
    const msg = await message.reply("🏓 Ping!");
    msg.delete();
    message.reply(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.client.ws.ping)}ms.)`);
  }
}
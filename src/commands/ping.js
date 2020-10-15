const Command = require('../structures/Command');

module.exports = class PingCommand extends Command {
    constructor() {
        super(client, {
            name: "ping",
            description: "Latency and API response times.",
            usage: "ping",
            aliases: ["pong"]
        })
    }

    async run(message, args) {
        try {
            const msg = await message.channel.send("🏓 Ping!");
            msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.client.ws.ping)}ms.)`);
        } catch (e) { 
            msg.send("We seem to be having some trouble with this command right now, please send the error below to a developer.\n\n" + e);
        }
    }
}
const Command = require('../structures/Command');

module.exports = class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "Evaluates arbitrary Javascript.",
            category: "System",
            usage: "eval <expression>",
            permLevel: "developers"
        });
    }

    async run(message, args) {
        const msg = message;
        const code = args.join(" ");
        try {
            const evaled = eval(code);
            const clean = await this.client.clean(evaled);

            const MAX_CHARS = 3 + 2 + clean.length + 3;
            if (MAX_CHARS > 2000) {
                message.channel.send("Output exceeded 2000 characters. Sending as a file.", { files: [{ attachment: Buffer.from(clean), name: "output.txt" }] });
            }
            message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(this.client, err.message)}\n\`\`\``);
        }
    }
}
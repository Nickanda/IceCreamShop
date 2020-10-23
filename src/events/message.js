module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.author.bot) return;
        if (message.system) return;

        if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

        const settings = await this.client.getSettings(message.guild);

        message.settings = settings;

        const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
        if (message.content.match(prefixMention)) {
            return message.reply(`My prefix on this server is \`${settings.get('prefix')}\``);
        }

        if (message.content.indexOf(settings.get('prefix')) !== 0) return;

        const args = message.content.slice(settings.get('prefix').length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (message.guild && !message.member) await message.guild.fetchMember(message.author);

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;

        if (cmd && !message.guild && cmd.conf.guildOnly)
            return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

        // if (level < this.client.levelCache[cmd.conf.permLevel]) {
        //     if (settings.systemNotice === "true") {
        //         return message.channel.send(`You do not have permission to use this command.
        //             Your permission level is ${level} (${this.client.settings.permLevels.find(l => l.level === level).name})
        //             This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
        //     } else {
        //         return;
        //     }
        // }

        if (cmd.conf.permLevel !== "") {
            if (!this.client.botStaff[cmd.conf.permLevel].includes(message.author.id)) return message.channel.send('You do not have permission to use this command.');
        }

        this.client.logger.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
        
        try {
            cmd.run(message, args);
        } catch(e) {
            message.reply(e);
        }
    }
};
module.exports = class Command {
    constructor(client, {
        name = null,
        description = "No description provided.",
        category = "Miscellaneous",
        usage = "No usage provided.",
        enabled = true,
        guildOnly = false,
        aliases = new Array()
    }) {
        this.client = client;
        this.conf = { enabled, guildOnly, aliases };
        this.help = { name, description, category, usage };
    }
}
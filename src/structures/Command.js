module.exports = class Command {
  constructor(client, {
    name = null,
    description = "No description provided.",
    category = "Miscellaneous",
    usage = "No usage provided.",
    enabled = true,
    options = new Array(),
    permLevel = "",
    permissions = new Array()
  } = {}) {
    this.client = client;
    this.conf = { enabled, permLevel, permissions };
    this.help = { name, description, category, usage, options };
  }
}
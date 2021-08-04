module.exports = class Command {
  constructor(client, {
    name = null,
    description = "No description provided.",
    category = "Miscellaneous",
    usage = "No usage provided.",
    enabled = true,
    options: [],
    permLevel = ""
  } = {}) {
    this.client = client;
    this.conf = { enabled, permLevel };
    this.help = { name, description, category, usage, options };
  }
}
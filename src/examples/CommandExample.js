const Command = require("../base/Command.js");

module.exports = class ExampleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "example",
      description: "Example.",
      usage: "example",
      category: "Miscellaneous",
      enabled: true,
      options: [
        {
          type: "STRING",
          name: "example",
          description: "example",
          required: true
        }
      ]
    });
  }

  async run(message, args) {

  }
}
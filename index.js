const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");
const Discord = require('discord.js');
const express = require('express');

const Client = require('./src/structures/Client');

const client = new Client({
  fetchAllMembers: true,
  messageCacheMaxSize: 20,
  messageCacheLifetime: 120,
  messageSweepInterval: 120,
  messageEditHistoryMaxSize: 1,
  ws: {
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]
  }
});

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://20454f919fd14b11ac6f24fbd436d5ed@o459376.ingest.sentry.io/5458429",
  tracesSampleRate: 1.0,
});

const init = async () => {
  klaw("./src/commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) client.logger.error(response);
  });

  const evtFiles = await readdir("./src/events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = new (require(`./src/events/${file}`))(client);

    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./src/events/${file}`)];
  });

  client.database.connect(`mongodb+srv://${this.config.database.username}:${this.config.database.password}@${this.config.database.host}/iceCreamShop?retryWrites=true&w=majoritye`, { useNewUrlParser: true, useUnifiedTopology: true });

  client.cooldowns.deleteMany()
  client.votes.deleteMany()
  client.shops.deleteMany()
  client.settings.deleteMany()

  client.login(client.config.discordToken)

  const app = express();

  app.post("/dblwebhook", client.topgg.listener(vote => {
    client.votes.insertOne({
      userId: vote.user,
      claimed: false,
      createdAt: Date()
    });
  }));

  app.listen(5000);
}

init();

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

String.prototype.toProperCase = function (opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
    .replace(/(^|[\s\xA0])[^\s\xA0]/g, function (s) { return s.toUpperCase(); });
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * length)];
};

process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});

// process.on("SIGINT", async () => {
//   const embed = new Discord.MessageEmbed()
//     .setTitle("Bot Rebooting")
//     .setColor(0xFFFF00)
//     .setFooter('i!help')
//     .setTimestamp();

//   const statusChannel = await client.channels.fetch("798740320363085865");
//   statusChannel.send(embed);
// });
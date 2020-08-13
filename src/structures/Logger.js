const moment = require('moment');
const chalk = require('chalk');

module.exports = class Logger {
    constructor() { }

    log(content, type = "log") {
        const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
        switch (type) {
            case "log": {
                return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
            }
            case "warn": {
                return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
            }
            case "error": {
                return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
            }
            case "debug": {
                return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
            }
            case "cmd": {
                return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
            }
            case "ready": {
                return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
            }
            default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
        }
    }

    warn(...args) {
        this.log(...args, "warn")
    }

    error(...args) {
        this.log(...args, "error")
    }

    debug(...args) {
        this.log(...args, "debug")
    }

    cmd(...args) {
        this.log(...args, "cmd")
    }
}
const StoreHandler = require('./StoreHandler');

module.exports = class ShopHandler extends StoreHandler {
    constructor(client) {
        super(client);
    }

    formatDate(milliseconds) {
        milliseconds = Math.floor(milliseconds / 1000);
        const seconds = milliseconds % 60;
        milliseconds /= 60;
        const minutes = Math.floor(milliseconds % 60);
        milliseconds /= 60;
        const hours = Math.floor(milliseconds % 24);

        return `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${seconds > 0 ? seconds + " seconds" : ""}`;
    }

    async getProfile(message) {
        try {
            const profile = await this.client.shops.findOrCreate({
                where: {
                    userId: message.author.id
                },
                defaults: {
                    userId: message.author.id
                }
            });
            return profile[0];
        } catch (e) {
            console.log(e);
        }
    }

    async getCooldowns(message, filter) {
        try {
            const cooldowns = await this.client.cooldowns.findAll({
                where: {
                    userId: message.author.id
                }
            });

            let cooldown = "";
            cooldowns.forEach(cooldownItem => {
                if (cooldownItem.get("action") == filter) {
                    cooldown = cooldownItem;
                }
            });

            return cooldown === "" ? undefined : cooldown;
        } catch (e) {
            console.log(e);
        }
    }

    async claimDaily(message) {
        return new Promise(async (res, rej) => {
            try {
                const profile = await this.getProfile(message);
                const cooldown = await this.getCooldowns(message, "daily");

                if (!cooldown || (Date.now() - Date.parse(cooldown.createdAt) > cooldown.duration && Date.now() - Date.parse(cooldown.createdAt) < (cooldown.duration + 86400000))) { // between 22 hrs and 48 hrs
                    await profile.increment("money", {
                        where: {
                            userId: message.author.id
                        },
                        by: 50
                    });

                    if (cooldown) await cooldown.destroy();

                    await this.client.cooldowns.create({
                        userId: message.author.id,
                        action: "daily",
                        duration: 72000000
                    });

                    res(true);
                } else {
                    rej("Daily reward has already been claimed. Please wait " + this.formatDate(cooldown.duration - (Date.now() - Date.parse(cooldown.createdAt))));
                }
            } catch (e) {
                console.log(e)
                rej(e);
            }
        })
    }

    async refreshMachineCapacity(message) {
        return new Promise(async (res, rej) => {
            try {
                const profile = await this.getProfile(message);

                const parsedMachines = JSON.parse(profile.machineCapacity)
                const timeDifference = Date.now() - Date.parse(profile.lastRefill);
                let capacityDifference = Math.floor(timeDifference / 288000) * 1;

                let newMachines = {};
                let decreased = false;
                for (let machine in parsedMachines) {
                    if (!decreased) {
                        if (parsedMachines[machine]["capacity"] - capacityDifference < 0) {
                            capacityDifference["capacity"] -= parsedMachines;
                            newMachines[machine] = {
                                type: parsedMachines[machine]["type"],
                                capacity: 0
                            };
                        } else {
                            newMachines[machine] = {
                                type: parsedMachines[machine]["type"],
                                capacity: parsedMachines[machine]["capacity"] - capacityDifference
                            };
                            decreased = true;
                        }
                    } else {
                        newMachines[machine] = parsedMachines[machine];
                    }
                }

                this.client.shops.update({
                    machineCapacity: JSON.stringify(newMachines),
                    lastRefill: Date()
                }, {
                    where: {
                        userId: message.author.id
                    }
                })

                res(newMachines);
            } catch (e) {
                console.log(e)
                rej(e);
            }
        })
    }
}
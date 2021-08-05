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
      const profile = await this.client.shops.findOneAndUpdate({
        userId: message.author?.id ?? message.user?.id
      },
        {
          $setOnInsert: {
            userId: message.author?.id ?? message.user?.id,
            name: "Ice Cream Shop",
            money: 1000,
            customerMax: 10,
            machineCapacity: [ { type: "Basic", capacity: 100, flavor: "vanilla" } ],
            lastRefill: Date.now(),
            flavors: ["vanilla"],
            advertisements: [],
            dailyStreak: 0,
            premiumExpiration: null,
            createdAt: Date.now()
          }
        }, {
        returnOriginal: false,
        upsert: true
      });

      return profile
    } catch (e) {
      console.log(e);
    }
  }

  async getCooldowns(message, filter) {
    try {
      const cooldowns = await this.client.cooldowns.findOne({
        userId: message.author?.id ?? message.user?.id,
        action: filter
      });

      return cooldowns;
    } catch (e) {
      console.log(e);
    }
  }

  async getVotes(message) {
    try {
      await this.client.votes.deleteMany({
        userId: message.author?.id ?? message.user?.id,
        createdAt: {
          $lte: Date.parse(Date.now() - 43200000)
        }
      })

      const vote = await this.client.votes.findOne({
        userId: message.author?.id ?? message.user?.id
      });

      return vote;
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
          let dailyReward = 50;

          await this.client.shops.updateOne({
            userId: message.author?.id ?? message.user?.id
          }, {
            $inc: {
              dailyStreak: 1
            }
          });

          if (profile.dailyStreak + 1 == 5) {
            dailyReward = 200;

            await this.client.shops.updateOne({
              userId: message.author?.id ?? message.user?.id
            }, {
              $inc: {
                money: dailyReward
              },
              $set: {
                dailyStreak: 0
              }
            });
          }

          if (cooldown) await this.client.cooldowns.deleteMany({
            userId: message.author?.id ?? message.user?.id,
            action: "daily"
          });

          await this.client.cooldowns.create({
            userId: message.author?.id ?? message.user?.id,
            action: "daily",
            duration: 72000000,
            createdAt: Date()
          });

          res(true);
        } else if (Date.now() - Date.parse(cooldown.createdAt) > (cooldown.duration + 86400000)) {
          await this.client.shops.updateOne({
            userId: message.author?.id ?? message.user?.id
          }, {
            $inc: {
              money: 50,
            },
            $set: {
              dailyStreak: 0
            }
          });

          if (cooldown) await this.client.cooldowns.deleteMany({
            userId: message.author?.id ?? message.user?.id,
            action: "daily"
          });

          await this.client.cooldowns.create({
            userId: message.author?.id ?? message.user?.id,
            action: "daily",
            duration: 72000000,
            createdAt: Date()
          });

          res(true);
        } else {
          rej("Daily reward has already been claimed. Please wait " + this.formatDate(cooldown.duration - (Date.now() - Date.parse(cooldown.createdAt))));
        }
      } catch (e) {
        console.log(e);
        rej(e);
      }
    });
  }

  async refreshMachineCapacity(message) {
    return new Promise(async (res, rej) => {
      try {
        const profile = await this.getProfile(message);

        const boost = await this.calculateBoosts(profile.advertisements, profile.machineCapacity)
        const timeDifference = Date.now() - Date.parse(profile.lastRefill);
        let capacityDifference = Math.floor(timeDifference / 288000);
        let idleMoney = Math.floor(capacityDifference * .5 * boost);

        let newMachines = [];
        let decreased = false;
        profile.machineCapacity.forEach((machine, index) => {
          if (!decreased) {
            if (machine["capacity"] - capacityDifference < 0) {
              capacityDifference -= machine["capacity"];
              newMachines[index] = {
                type: machine["type"],
                capacity: 0,
                flavor: machine["flavor"]
              };
            } else {
              newMachines[index] = {
                type: machine["type"],
                capacity: machine["capacity"] - capacityDifference,
                flavor: machine["flavor"]
              };
              decreased = true;
            }
          } else {
            newMachines[index] = machine;
          }
        })
          
        await this.client.shops.updateOne({
          userId: message.author?.id ?? message.user?.id
        }, {
          $inc: {
            money: idleMoney
          },
          $set: {
            machineCapacity: newMachines,
            lastRefill: Date()
          }
        });

        res(newMachines);
      } catch (e) {
        console.log(e);
        rej(e);
      }
    });
  }
}
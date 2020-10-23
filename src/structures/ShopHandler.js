module.exports = class ShopHandler {
    constructor(client) {
        this.client = client;
    }

    async getProfile(message) {
        try {
            const profile = await this.client.shops.findOrCreate({
                where: { userId: message.author.id }, defaults: {
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
                where: { userId: message.author.id }
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
        try {
            const profile = await this.getProfile(message);
            const cooldown = await this.getCooldowns(message, "daily");

            if (!cooldown || (Date.now() - Date.parse(cooldown.createdAt) > 79200000 && Date.now() - Date.parse(cooldown.createdAt) < 172800000)) { // between 22 hrs and 48 hrs
                await profile.increment("money", {
                    where: {
                        userId: message.author.id
                    },
                    by: 50
                });

                if (cooldown) await cooldown.destroy();

                await this.client.cooldowns.create({
                    userId: message.author.id,
                    action: "daily"
                });

                return true;
            } else {
                return false, "Daily reward has already been claimed. Please wait ";
            }
        } catch (e) {
            console.log(e)
            return false, e;
        }
    }


}
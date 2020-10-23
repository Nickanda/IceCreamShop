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
            console.log(e)
        }
    }
}
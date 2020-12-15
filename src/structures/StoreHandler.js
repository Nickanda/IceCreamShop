module.exports = class StoreHandler {
    constructor(client) {
        this.client = client;

        this.ads = {
            "Newspaper Ad": {
                cost: 200,
                duration: 1000 * 60 * 60 * 4, // 4 hours
                boost: 1.1
            },
            "Radio Ad": {
                cost: 350,
                duration: 1000 * 60 * 60 * 6, // 12 hours
                boost: 1.15
            },
            "TV Ad": {
                cost: 500,
                duration: 1000 * 60 * 60 * 12, // 12 hours
                boost: 1.25
            },
            "Digital Ad": {
                cost: 1000,
                duration: 1000 * 60 * 60 * 18, // 18 hours
                boost: 1.5
            },
            "Billboard Ad": {
                cost: 2500,
                duration: 1000 * 60 * 60 * 24,
                boost: 2
            },
            "Airplane Ad": {
                cost: 5000,
                duration: 1000 * 60 * 60 * 8,
                boost: 4
            }
        };

        this.flavors = {
            "vanilla": {
                cost: 0,
                boost: 1
            },
            "chocolate": {
                cost: 50,
                boost: 1.05
            },
            "strawberry": {
                cost: 50,
                boost: 1.05
            },
            "chocolate chip": {
                cost: 100,
                boost: 1.1
            },
            "cookie & cream": {
                cost: 100,
                boost: 1.1
            }
        };
    }

    
}
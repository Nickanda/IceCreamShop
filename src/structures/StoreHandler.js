module.exports = class StoreHandler {
    constructor(client) {
        this.client = client;

        this.ads = {
            "Newspaper": {
                cost: 200,
                duration: 1000 * 60 * 60 * 4,
                boost: 1.1
            },
            "Radio": {
                cost: 350,
                duration: 1000 * 60 * 60 * 6,
                boost: 1.15
            },
            "TV": {
                cost: 500,
                duration: 1000 * 60 * 60 * 12,
                boost: 1.25
            },
            "Google": {
                cost: 1000,
                duration: 1000 * 60 * 60 * 18,
                boost: 1.5
            },
            "Billboard": {
                cost: 2500,
                duration: 1000 * 60 * 60 * 24,
                boost: 2
            },
            "Airplane": {
                cost: 5000,
                duration: 1000 * 60 * 60 * 8,
                boost: 4
            },
            "YouTube": {

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

        this.machines = {
            "Basic": {
                cost: 2500,
                boost: 1
            },
            "Regular": {
                cost: 10000,
                boost: 1.25
            },
            "Improved": {
                cost: 25000,
                boost: 1.5
            },
            "Advanced": {
                cost: 50000,
                boost: 2
            }
        }
    }

    async calculateBoosts(ads, machines) {
        let currentBoost = 1

        ads.forEach(ad => {
            currentBoost += 1 - this.ads[ad["type"]]["boost"];
        });

        for (let machine in machines) {
            const flavor = machines[machine]["flavor"];

            currentBoost += 1 - this.machines[machines[machine]["type"]]["boost"];
            currentBoost += 1 - this.flavors[flavor]["boost"];
        }

        await this.client.wait(50);

        return currentBoost;
    }
}
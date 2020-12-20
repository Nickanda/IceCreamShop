module.exports = class StoreHandler {
    constructor(client) {
        this.client = client;

        this.ads = {
            "Newspaper": {
                id: "A01",
                cost: 200,
                duration: 1000 * 60 * 60 * 4,
                boost: 1.1
            },
            "Radio": {
                id: "A02",
                cost: 350,
                duration: 1000 * 60 * 60 * 6,
                boost: 1.15
            },
            "TV": {
                id: "A03",
                cost: 500,
                duration: 1000 * 60 * 60 * 12,
                boost: 1.25
            },
            "Google": {
                id: "A04",
                cost: 1000,
                duration: 1000 * 60 * 60 * 18,
                boost: 1.5
            },
            "Billboard": {
                id: "A05",
                cost: 2500,
                duration: 1000 * 60 * 60 * 24,
                boost: 2
            },
            "Airplane": {
                id: "A06",
                cost: 5000,
                duration: 1000 * 60 * 60 * 8,
                boost: 2
            },
            "YouTube": {
                id: "A07",
                cost: 10000,
                duration: 1000 * 60 * 60 * 12,
                boost: 5
            }
        };

        this.flavors = {
            "vanilla": {
                id: "F01",
                cost: 0,
                boost: 1
            },
            "chocolate": {
                id: "F02",
                cost: 50,
                boost: 1.05
            },
            "strawberry": {
                id: "F03",
                cost: 50,
                boost: 1.05
            },
            "chocolate chip": {
                id: "F04",
                cost: 100,
                boost: 1.1
            },
            "cookie & cream": {
                id: "F05",
                cost: 100,
                boost: 1.1
            }
        };

        this.machines = {
            "Basic": {
                id: "M01",
                cost: 2500,
                boost: 1
            },
            "Regular": {
                id: "M02",
                cost: 10000,
                boost: 1.25
            },
            "Improved": {
                id: "M03",
                cost: 25000,
                boost: 1.5
            },
            "Advanced": {
                id: "M04",
                cost: 50000,
                boost: 2
            }
        }
    }

    async calculateBoosts(ads, machines) {
        console.log(machines)
        ads = JSON.parse(ads);
        machines = JSON.parse(machines);
        console.log(machines)

        let currentBoost = 1

        for (let ad in ads) {
            currentBoost += 1 - this.ads[ad["type"]]["boost"];
        };

        for (let machine in machines) {
            const flavor = machines[machine]["flavor"];

            currentBoost += 1 - this.machines[machines[machine]["type"]]["boost"];
            currentBoost += 1 - this.flavors[flavor]["boost"];
        }

        await this.client.wait(50);

        return currentBoost;
    }
}
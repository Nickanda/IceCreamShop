const Client = require('./src/structures/Client');

const client = new Client();

const init = async () => {
    

    client.login(client.settings.discrodToken)
}

init();
const { sendSplashCommand } = require('./../commands');

class ReadyEvent {
    constructor(client) {
        this.client = client;
        this.name = 'ready';
        this.listenerType = 'once';
    }

    handler() {
        console.log(`Logged in as ${this.client.user.tag}!`);
        sendSplashCommand(this.client)
            .then((commands) => {
                for (const command of commands) {
                    this.client.commands.set(
                        command.properties.name,
                        command
                    );
                    console.log('[CLIENT] ✅ %s send and saved', command.properties.name);
                }
            })
    }
}

module.exports = ReadyEvent;

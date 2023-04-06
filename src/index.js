require('dotenv').config();
const { Client, GatewayIntentBits, REST } = require('discord.js');
const path = require('node:path');
const events = require('./events/exports');

class OhorimeClient extends Client {
    constructor(clientOptions) {
        super(clientOptions);

        this.rest = new REST({ version: this.options.rest.version }).setToken(this.token);

        this.commands = new Map();
        
        for (const EventConstructor of Object.values(events)) {
            const event = new EventConstructor(this);
            this[event.listenerType](event.name, (...args) => event.handler(...args));    
        }

        this.experiencesWorker = new Worker(
            path.resolve(path.join(__dirname, 'workers', 'experiences.js'),
            {
                name: 'experiences'
            })
        );
    }

    init(token) {
        return this.login(token);
    }
}

const client = new OhorimeClient({
    intents: [GatewayIntentBits.Guilds]
});

client.init(process.env.DISCORD_TOKEN);

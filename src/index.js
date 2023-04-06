require('dotenv').config();
const { Client, GatewayIntentBits, REST } = require('discord.js');
const path = require('node:path');
const events = require('./events/exports');
const { MongoClient } = require('mongodb');
const { Worker } = require('node:worker_threads');

class OhorimeClient extends Client {
    constructor(clientOptions) {
        super(clientOptions);

        this.rest = new REST({ version: this.options.rest.version }).setToken(this.token);

        this.mongo = new MongoClient(process.env.MONGODB_URI);
        this.db = this.mongo.db('ohorime');

        this.commands = new Map();
        
        for (const EventConstructor of Object.values(events)) {
            const event = new EventConstructor(this);
            this[event.listenerType](event.name, (...args) => event.handler(...args));
            console.log('[CLIENT] ➕ %s added to listener', event.name)  
        }

        this.experiencesWorker = new Worker(
            path.resolve(path.join(__dirname, 'workers', 'experiences.js')),
            {
                name: 'experiences'
            }
        );
        }
        
        init(token) {
            console.log('[CLIENT] 📶 Client trying connect to mongodb');

            this.mongo.connect()
                .then(() => {
                    console.log('[CLIENT] ✅ Mongodb connected');
                    return this.db.command({ ping: 1 })
                        .then((cmd) => {
                            console.log('[CLIENT] ✅ Database ping successfull');
                            if (cmd.ok == 1) {
                                return super.login(token);
                            } else {
                                console.log('[WORKER] ❌ Database ping failed');
                                throw Error(cmd);
                            }
                        })
                        .catch((e) => {
                            console.log('[CLIENT] ❌ Database ping failed');
                            throw Error(e);
                        })

                })
                .catch((e) => {
                    console.log('[CLIENT] ❌ Mongodb connection failed');
                    throw Error(e);
                })

    }
}

const client = new OhorimeClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
    ]
});

client.init(process.env.DISCORD_TOKEN);

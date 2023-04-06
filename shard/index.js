require('dotenv').config();
const { ShardingManager } = require('discord.js');
const path = require('node:path');

const manager = new ShardingManager(path.resolve(path.join(__dirname, '..', 'src', 'index.js')), {
    token: process.env.DISCORD_TOKEN,
    respawn: false,
    execArgv: ["src", "index.js", "mode=djs-manager"]
});

manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
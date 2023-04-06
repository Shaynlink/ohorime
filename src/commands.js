const { Routes } = require('discord.js');
const commandConstructors = require('./commands/exports');

function sendSplashCommand(client) {
    const commands = Object.values(commandConstructors).map((CommandConstructor) => new CommandConstructor(client));
    const body = commands.map((command) => command.properties);

    return client.rest.put(
            Routes.applicationCommands(client.user.id),
            { body }
        ).then(() => commands);
}

module.exports = {
    sendSplashCommand: sendSplashCommand
}
class interactionCreateEvent {
    constructor(client) {
        this.client = client;
        this.name = 'interactionCreate';
        this.listenerType = 'on';
    }

    handler(interaction) {
        if (interaction.isChatInputCommand()) {
            return this.isChatInputCommand(interaction);
        }
    }

    isChatInputCommand(interaction) {
        if (!this.client.commands.has(interaction.commandName)) {
            return interaction.reply('Error expected: command not found');
        }

        this.client.commands
            .get(interaction.commandName)
            .handler(interaction);
    }
}

module.exports = interactionCreateEvent;

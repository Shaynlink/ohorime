const { EmbedBuilder } = require('discord.js');
const { CATEGORY_EMOJIES } = require('../categories');

class Help {
    constructor(client) {
        this.client = client;

        this.properties = {
            name: 'help',
            description: 'Show commands list'
        };

        this.category = 'misc';
    }

    async handler(interaction) {
        const group = {};

        for (const command of this.client.commands.values()) {
            if (!(command.category in group)) {
                group[command.category] = [command.properties.name];
            } else {
                group[command.category].push(command.properties.name);
            }
        }

        const helpEmbed = new EmbedBuilder()
            .setColor(0xD90AEA)
            .setTitle('Commands list')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL({
                    size: 16
                })
            })
            .setDescription(`Help 💡 | Commands list ${this.client.commands.size}`)
            .addFields(
                ...Object
                    .entries(group)
                    .map((category) => ({
                        name: `${CATEGORY_EMOJIES[category[0]]} ${category[0]}`,
                        value: `\`${category[1].join('`, `')}\``
                    }))
            );

        interaction.reply({ embeds: [helpEmbed] });
    }
}

module.exports = Help;
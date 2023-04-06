const { EmbedBuilder, Status } = require('discord.js');

class Ping {
    constructor(client) {
        this.client = client;

        this.properties = {
            name: 'ping',
            description: 'Testing bot response'
        };

        this.category = 'misc';
    }

    async handler(interaction) {
        const shard = this.client.shard;
        const shardPing = this.client.ws.shards.get(shard.ids[0]).ping;

        const pingEmbed = new EmbedBuilder()
            .setColor(0xD90AEA)
            .setTitle('Ping response')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL({
                    size: 16
                })
            })
            .setDescription(`Ping 🏓 | Shard ID: \`${shard.ids[0]}\``)
            .addFields(
                { name: 'shard status', value: `${Status[this.client.ws.status]}`, inline: true },
                { name: 'shard ping', value: `${shardPing} ms`, inline: true },
                { name: 'shard average ping', value: `${this.client.ws.ping} ms`, inline: true }
            );


        return interaction.reply({ embeds: [pingEmbed] });
    }
}

module.exports = Ping;
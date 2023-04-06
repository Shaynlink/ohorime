const { EmbedBuilder } = require('discord.js');
const { calculateLevel } = require('../../utils/utils');

class Xp {
    constructor(client) {
        this.client = client;

        this.properties = {
            name: 'xp',
            description: 'Show your xp'
        };

        this.category = 'experiences';
    }

    async handler(interaction) {
        const collection = this.client.db.collection('experiences');

        const result = await collection.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        if (!result) {
            return interaction.reply('❌ You are not saved on database yet, please retry this command');
        }

        const xpEmbed = new EmbedBuilder()
            .setColor(0xD90AEA)
            .setTitle('Your level')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL({
                    size: 16
                })
            })
            .setDescription(`${interaction.user.username}' exps`)
            .addFields(
                { name: 'Level', value: `lvl ${Math.floor(calculateLevel(result.experiences))}`, inline: true },
                { name: 'Exp', value: `${result.experiences} xp`, inline: true }
            );
        
        return interaction.reply({ embeds: [xpEmbed] });
    }
}

module.exports = Xp;
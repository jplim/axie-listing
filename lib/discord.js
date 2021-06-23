const DiscordJS = require('discord.js');

require('dotenv').config();

class Discord {
    async sendEmbed(embedProps) {
        const webhookClient = new DiscordJS.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

        const embed = new DiscordJS.MessageEmbed()
            .setThumbnail(embedProps.imageUrl)
            .addField('Name:', embedProps.name)
            .addField('Price:', embedProps.price);

        embed.addField('Link:', embedProps.url)
            .setTimestamp();

        webhookClient.send('', {
            embeds: [embed]
        });
    }
}

module.exports = Discord;
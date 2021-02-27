const commando = require('discord.js-commando');

module.exports = class GuildListCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'guilds',
			group: 'misc',
			memberName: 'guilds',
			description: 'Lists the guilds the bot is in',
			ownerOnly: true,
			hidden: true,
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
		});
	}

	async run(message) {
		this.client.guilds.cache.forEach((guild) => {
			message.channel.send(`**${guild.name}** | **${guild.id}** | Member count **${guild.memberCount}**`);
		});
	}

};
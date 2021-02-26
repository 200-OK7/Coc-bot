const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');

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
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		this.client.guilds.cache.forEach((guild) => {
			message.channel.send(`**${guild.name}** | Member count **${guild.memberCount}**`);
		});
	}

};
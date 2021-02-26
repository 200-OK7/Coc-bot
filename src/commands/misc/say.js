const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class SayCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'say',
			group: 'misc',
			memberName: 'say',
			aliases: ['speak'],
			description: 'Says what you tell it too.',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [
				{
					key: 'text',
					prompt: 'What would you like me to say?',
					type: 'string',
				},
			],
		});
	}
	async run(message, { text }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}
		message.delete();
		message.channel.send(text);

		console.log(`Command: say was run by ${message.author.username} saying ${text}`);
	}

};


const commando = require('discord.js-commando');

module.exports = class LeaveGuildCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'leaveguild',
			group: 'misc',
			memberName: 'leaveguild',
			description: 'Makes the bot leave a guild',
			ownerOnly: true,
			hidden: true,
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'guild',
				prompt: 'What guild would you like to leave?',
				type: 'string',
			}],
		});
	}

	run(message, { guild }) {
		this.client.guilds.cache.get(guild)
			.leave()
			.then(g => console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: leave guild leaving guild ${g}. Ran by ${message.author.username} | ${message.author.id}`))
			.catch(console.error);
	}

};
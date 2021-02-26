const commando = require('discord.js-commando');

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
	run(message, { text }) {
		message.delete();
		message.channel.send(text);

		console.log(`Command: say was run by ${message.author.username} saying ${text}`);
	}

};


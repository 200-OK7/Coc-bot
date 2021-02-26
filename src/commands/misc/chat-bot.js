const commando = require('discord.js-commando');
const fetch = require('node-fetch');
const { apiChatKey } = require('../../../config.json');

module.exports = class ChatBotCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'chat',
			group: 'misc',
			memberName: 'chat',
			aliases: ['chatbot'],
			description: 'Have a convo with a chatbot',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'query',
				prompt: 'What would you like to say?',
				type: 'string',
			}],
		});
	}

	async run(message, { query }) {
		fetch(`${apiChatKey}uid=${message.member.id}&msg=${encodeURIComponent(query)}`)
			.then(res => res.json())
			.then(data => {
				message.channel.send(data.cnt);
			});
		console.log(`Command: Chat was run by ${message.author.id} searching for ${query}`);
	}

};
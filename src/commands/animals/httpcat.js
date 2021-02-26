const { MessageEmbed } = require('discord.js');
const commando = require('discord.js-commando');

module.exports = class HttpCatCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'httpcat',
			group: 'animals',
			memberName: 'httpcat',
			description: 'Gets a http cat',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'query',
				prompt: 'What cat would you like',
				type: 'string',
			}],
		});
	}

	async run(message, { query }) {
		const responseCat = `https://http.cat/${query}.jpg`;

		const embed = new MessageEmbed()
			.setColor('#E54449')
			.setTitle('Here is your HTTP cat')
			.setImage(responseCat);

		message.reply(embed);

		console.log(`Command: HTTP cat was run by ${message.author.username} searching for cat ${query}`);

	}

};
const commando = require('discord.js-commando');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = class RandomCatCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			group: 'animals',
			memberName: 'cat',
			aliases: ['randomcat', 'randcat'],
			description: 'Gets a random cat',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
		});
	}

	async run(message) {

		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		const embed = new MessageEmbed()
			.setColor('#E54449')
			.setTitle('Here\'s a random cat.')
			.setImage(file);

		message.reply(embed);

		console.log(`Command: Random cat was run by ${message.author.username}`);

	}

};
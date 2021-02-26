const commando = require('discord.js-commando');

module.exports = class AboutCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'about',
			group: 'misc',
			memberName: 'abbout',
			description: 'About the bot',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
		});
	}

	async run(message) {
		const embed = {
			'color': 15025225,
			'footer': {
				'text': 'Developed by 200 OK#0780',
			},
			'thumbnail': {
				'url': 'https://files.200ok.space/Cat.gif',
			},
			'author': {
				'name': 'About Coc Bot',
				'url': 'https://200ok.space',
			},
			'fields': [
				{
					'name': 'Bot Technicals :hammer_pick: ',
					'value': 'Javascript using **Discord.js**\nDatabase using **MongoDB**\nFramework using **Commando**\nChance using **npm chance**\n Fetch requests using **node-fetch**',
				},
				{
					'name': 'Support Coc Bot :moneybag: ',
					'value': '__Bitcoin__\n**3P7MkvQEmE7iudQF5Z74YW5TKBwvBj3YCL**\n__Ethereum__\n**0xe59c1c3CEce7d85154F36ebc801471f85aF4b23D** ',
				},
			],
		};
		message.channel.send({ embed });
	}

};
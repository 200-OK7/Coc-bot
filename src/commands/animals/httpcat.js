const { MessageEmbed } = require('discord.js');
const guildProfile = require('../../schemas/guild-schema');
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
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: httpcat for cat ${query} as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const responseCat = `https://http.cat/${query}.jpg`;

		const embed = new MessageEmbed()
			.setColor('#E54449')
			.setTitle('Here is your HTTP cat')
			.setImage(responseCat);

		message.reply(embed);

		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: http cat for cat ${query}. Ran by ${message.author.username} | ${message.author.id}`);

	}

};
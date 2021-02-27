const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');
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
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: random cat as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		const embed = new MessageEmbed()
			.setColor('#E54449')
			.setTitle('Here\'s a random cat.')
			.setImage(file);

		message.reply(embed);

		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: random cat. Ran by ${message.author.username} | ${message.author.id}`);

	}

};
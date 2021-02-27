const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = class RandomDogCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			group: 'animals',
			memberName: 'dog',
			aliases: ['randomdog', 'randdog'],
			description: 'Gets a random dog',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
		});
	}

	async run(msg) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: msg.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			msg.reply('This guild has been blacklisted');
			console.log(`Guild: ${msg.guild.name} | ${msg.guild.id}. Tried to run command: random dog as blacklisted. Ran by ${msg.author.username} | ${msg.author.id}`);
			return;
		}

		const { message } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());

		const embed = new MessageEmbed()
			.setColor('#E54449')
			.setTitle('Here\'s a random dog.')
			.setImage(message);

		msg.reply(embed);

		console.log(`Guild: ${msg.guild.name} | ${msg.guild.id}. Ran command: random dog. Ran by ${msg.author.username} | ${msg.author.id}`);

	}

};
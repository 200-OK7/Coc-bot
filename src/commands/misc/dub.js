/* eslint-disable no-mixed-spaces-and-tabs */
const commando = require('discord.js-commando');
const dubs = ['https://cdn.discordapp.com/attachments/806486565559205918/816471312544563241/20210303_004424.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471312775118888/20210303_004406.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313006854164/20210303_004355.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313245667348/20210303_004348.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313546870854/20210303_004345.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313719099402/20210303_004341.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471314020696094/20210303_004337.jpg'];
const guildProfile = require('../../schemas/guild-schema');

module.exports = class FeedCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'dub',
			group: 'misc',
			memberName: 'dub',
			aliases: ['w', 'win'],
			description: 'Gets a random dub',
			guildOnly: true,
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
			return;
		}

		const dub = dubs[Math.floor(Math.random() * dubs.length)];

		message.channel.send(dub);
		console.log(`Command: dub was run by ${message.author.username}`);
	}


};
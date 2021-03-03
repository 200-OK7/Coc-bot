/* eslint-disable no-mixed-spaces-and-tabs */
const commando = require('discord.js-commando');
const dubs = ['https://cdn.discordapp.com/attachments/806486565559205918/816471312544563241/20210303_004424.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471312775118888/20210303_004406.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313006854164/20210303_004355.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313245667348/20210303_004348.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313546870854/20210303_004345.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471313719099402/20210303_004341.jpg',
	'https://cdn.discordapp.com/attachments/806486565559205918/816471314020696094/20210303_004337.jpg',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658055595819059/2Q.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658097170284554/yiXUJ6ah.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658137930268672/Z.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658236547006484/9k.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658265190170654/Z.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658326993502228/9k.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658411889885214/9k.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658462653022239/65d.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658547793854537/db4.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816658689728970752/EX3f2C4WAAAsqZm.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662124083675146/ESZY171XQAUzOh7.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662191054520330/EX3fynqWkAEsRi3.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662227826376704/images.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662301553590312/images.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662367169282108/KnhE1tj.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662442607116299/EUlzircU0AEcqHV.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662467634659378/5b4.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662539789926471/bda.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662747668152320/ESqmFUCXkAIEK_B.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662777166299196/d220d15d485d630bdf93036f1c73417d.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662837828255764/8a0.png',
	'https://cdn.discordapp.com/attachments/771402687312035881/816662925313966140/365.png'];
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
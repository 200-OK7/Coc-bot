const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class WorkCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'work',
			group: 'economy',
			memberName: 'work',
			description: 'Work for some skrilla',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 60,
			},
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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: work as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: message.author.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: work but ${message.author.username} does not have a profile. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileSearch = await profile.findOne({ userID: message.author.id });
		const skrilla = profileSearch.skrilla;
		const workAmount = Math.floor((Math.random() * 1000) + 500);
		const newBalance = skrilla + workAmount;

		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newBalance } });
		message.reply(`You worked and gained **${workAmount}** Skrilla.`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: work gaining ${workAmount}. Ran by ${message.author.username} | ${message.author.id}`);
	}

};


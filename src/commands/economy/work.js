const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const blacklisted = require('../../utils/blacklistcheck');
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
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: message.author.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			return;
		}

		const blacklist = await blacklisted(message);
		if (blacklist == true) {
			message.reply('You\'ve been blacklisted');
			return;
		}

		const profileSearch = await profile.findOne({ userID: message.author.id });
		const skrilla = profileSearch.skrilla;
		const workAmount = Math.floor((Math.random() * 1000) + 500);
		const newBalance = skrilla + workAmount;

		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newBalance } });
		message.reply(`You worked and gained **${workAmount}** Skrilla.`);

		console.log(`Command: work was run by ${message.author.username}`);
	}

};


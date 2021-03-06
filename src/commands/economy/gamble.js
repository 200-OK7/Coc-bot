const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class GambleCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'gamble',
			group: 'economy',
			memberName: 'gamble',
			description: 'Gamble your skrilla',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 5,
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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: gamble as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: message.author.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: gamble but a profile for ${message.author.username} does not exist. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileSearch = await profile.findOne({ userID: message.author.id });
		let gambleAmount = 0;
		let gambleMessage = '';
		const skrilla = profileSearch.skrilla;

		const d = Math.random();
		if (d <= 0.5) {
			gambleAmount = Math.floor((Math.random() * 1000) + skrilla);
		}
		else if (d < 0.7) {
			gambleAmount = Math.floor((Math.random() * 2000) + skrilla);
		}
		else {
			gambleAmount = Math.floor((Math.random() * 300) + -skrilla);
		}

		if (gambleAmount < 0) {
			gambleMessage = 'Your gamble did not pay off. You lost:';
		}
		else {
			gambleMessage = 'Your gamble payed off. You gained:';
		}
		const newBalance = skrilla + gambleAmount;

		if (newBalance < 0) {
			message.reply('This is an intervention, no more gambling until you\'ve earned more money');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: gamble but a negative balance was found. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newBalance } });
		message.reply(`${gambleMessage} **${gambleAmount}** Skrilla.`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: gamble for amount ${gambleAmount}. Ran by ${message.author.username} | ${message.author.id}`);

	}

};


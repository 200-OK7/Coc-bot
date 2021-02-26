/* eslint-disable no-mixed-spaces-and-tabs */
const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const Chance = require('chance');
const { prefix } = require('../../../config.json');
const chance = new Chance();
const blacklisted = require('../../utils/blacklistcheck');

module.exports = class JackpotCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'jackpot',
			group: 'economy',
			memberName: 'jackpot',
			guildOnly: true,
			description: 'Gamble your skrilla',
			throttling: {
				usages: 1,
				duration: 3,
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
		const jackpot = chance.bool({ likelihood: 0.01 });

		console.log(`Command: Jackpot was run by ${message.author.username} returning ${jackpot}`);

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

		const WinBalance = skrilla + 1000000000000000;
		const LoseBalance = skrilla - 100;

		if (skrilla >= 100) {
			if (jackpot == true) {
			    message.reply(`Congratulations! You won the jackpot, your new balance is ${WinBalance}.`);
			    await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: WinBalance } });
			    return;
		    }
		    else {
			    message.reply(`You lost the jackpot, better luck next time! Your balance is now **${LoseBalance} Skrilla.**`);
				await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: LoseBalance } });
			    return;
			}
		}
		else {
			message.reply('You\'re too poor to enter the jackpot. The cost is **100 Skrilla.**');
		}

	}

};


/* eslint-disable no-mixed-spaces-and-tabs */
const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const Chance = require('chance');
const { prefix } = require('../../../config.json');
const chance = new Chance();

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
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: jackpot as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const jackpot = chance.bool({ likelihood: 0.01 });
		const profileExistanceCheck = await profile.find({ userID: message.author.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: jackpot but a profile for ${message.author.username} does not exist. Ran by ${message.author.username} | ${message.author.id}`);
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
				console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: jackpot, ${message.author.name} won the jackpot. Ran by ${message.author.username} | ${message.author.id}`);
			    return;
		    }
		    else {
			    message.reply(`You lost the jackpot, better luck next time! Your balance is now **${LoseBalance} Skrilla.**`);
				await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: LoseBalance } });
				console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: jackpot, ${message.author.name} lost the jackpot. Ran by ${message.author.username} | ${message.author.id}`);
			    return;
			}
		}
		else {
			message.reply('You\'re too poor to enter the jackpot. The cost is **100 Skrilla.**');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: jackpot but ${message.author.name} did not have enough currency. Ran by ${message.author.username} | ${message.author.id}`);
		}

	}

};


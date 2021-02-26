const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const blacklisted = require('../../utils/blacklistcheck');
const { prefix } = require('../../../config.json');

module.exports = class BankDepositCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'deposit',
			group: 'economy',
			memberName: 'deposit',
			description: 'Deposits some skrilla into the bank',
			aliases: ['bankdepo', 'depo', 'bankdeposit'],
			throttling: {
				usages: 1,
				duration: 120,
			},
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [
				{
					key: 'amount',
					prompt: 'How much would you like to deposit?',
					type: 'string',
				},

			],
		});
	}
	async run(message, { amount }) {
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

		if (amount === 'max' || amount > 500) {
			amount = profileSearch.skrilla;
			if (amount > 500) {
				amount = 500;
			}
		}


		const currentSkrillaBalance = profileSearch.skrilla;
		const currentBankBalance = profileSearch.bankamount;
		const maxNewBank = currentBankBalance + 500;
		const newBankBalance = Number(currentBankBalance) + Number(amount);
		const newSkrillaBalance = currentSkrillaBalance - amount;

		console.log(`Command: bank withdraw was run by ${message.author.username} depositing ${amount} into their bank`);

		if (newSkrillaBalance < 0) {
			message.reply('You can\'t deposit more than you own');
			return;
		}

		if (newBankBalance > maxNewBank) {
			message.reply(`Try deposit a little less, your new bank balance can't be more than ${maxNewBank}`);
			return;
		}
		else {
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newSkrillaBalance } });
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { bankamount: newBankBalance } });
			message.reply(`Deposited **${amount}** into your bank, your new bank balance is ${newBankBalance}`);
		}

	}

};


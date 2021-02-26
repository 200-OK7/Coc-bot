const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const blacklisted = require('../../utils/blacklistcheck');
const { prefix } = require('../../../config.json');

module.exports = class BankWithdrawCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'withdraw',
			group: 'economy',
			memberName: 'withdraw',
			description: 'Withdraws some skrilla out of your bank',
			aliases: ['bankwitdraw'],
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [
				{
					key: 'amount',
					prompt: 'How much would you like to withdraw?',
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

		if (amount === 'max') {
			amount = profileSearch.bankamount;
		}

		const currentSkrillaBalance = profileSearch.skrilla;
		const currentBankBalance = profileSearch.bankamount;
		const newBankBalance = Number(currentBankBalance) - Number(amount);
		const newSkrillaBalance = Number(currentSkrillaBalance) + Number(amount);

		console.log(`Command: bank withdraw was run by ${message.author.username} withdrawing ${amount}`);

		if (newBankBalance < 0) {
			message.reply('You can\'t withdraw more than you own');
			return;
		}

		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newSkrillaBalance } });
		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { bankamount: newBankBalance } });
		message.reply(`Withdrew **${amount}** from your bank, your new balance is ${newSkrillaBalance}`);


	}

};


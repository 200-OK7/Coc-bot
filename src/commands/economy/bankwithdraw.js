const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class BankWithdrawCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'withdraw',
			group: 'economy',
			memberName: 'withdraw',
			description: 'Withdraws some skrilla out of your bank',
			guildOnly: true,
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
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: bank withdraw as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: message.author.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: bank withdraw but a profile for ${message.author.username} does not exist. Ran by ${message.author.username} | ${message.author.id}`);
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

		if (newBankBalance < 0) {
			message.reply('You can\'t withdraw more than you own');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: bank withdraw but a negative bank balance was found. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newSkrillaBalance } });
		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { bankamount: newBankBalance } });
		message.reply(`Withdrew **${amount}** from your bank, your new balance is ${newSkrillaBalance}`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: bank withdraw. Ran by ${message.author.username} | ${message.author.id}`);


	}

};


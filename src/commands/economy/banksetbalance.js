const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class BankSetBalanceCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setbankbalance',
			group: 'economy',
			memberName: 'setbankbalance',
			ownerOnly: true,
			hidden: true,
			description: 'Sets a users bank balance',
			aliases: ['setbankbal', 'bankbalset'],
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [
				{
					key: 'user',
					prompt: 'Whose bank balance would you like to change?',
					type: 'user',
					default: '',
				},
				{
					key: 'amount',
					prompt: 'What would you like to set their bank balance to?',
					type: 'string',
				},

			],
			argsType: 'multiple',
		});
	}
	async run(message, { amount, user }) {
		if (!user) {
			user = message.author;
		}

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: bank set balance but ${user.username} does not have a profile. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		await profile.findOneAndUpdate({ userID: user.id }, { $set: { bankamount: amount } });
		message.reply(`Set the bank balance of ${user.username} to ${amount}.`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: bank set balance setting ${user.username}s balance to ${amount}. Ran by ${message.author.username} | ${message.author.id}`);

	}

};


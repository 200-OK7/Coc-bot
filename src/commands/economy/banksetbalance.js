const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
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
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		if (!user) {
			user = message.author;
		}

		console.log(`Command set bank balance was run by ${message.author.username} setting ${user.username}s bank balance to ${amount}`);

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**`);
			return;
		}

		await profile.findOneAndUpdate({ userID: user.id }, { $set: { bankamount: amount } });
		message.reply(`Set the bank balance of ${user.username} to ${amount}.`);

	}

};


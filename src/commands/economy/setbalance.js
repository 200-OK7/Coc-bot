const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class SetBalanceCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setbalance',
			group: 'economy',
			memberName: 'setbalance',
			ownerOnly: true,
			hidden: true,
			description: 'Sets a users balance',
			guildOnly: true,
			aliases: ['setbal', 'balset', 'balanceset'],
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [
				{
					key: 'user',
					prompt: 'Whos balance would you like to change?',
					type: 'user',
					default: '',
				},
				{
					key: 'amount',
					prompt: 'What would you like to set their balance to?',
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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: set balance but ${user.username} does not have a profile. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		await profile.findOneAndUpdate({ userID: user.id }, { $set: { skrilla: amount } });
		message.reply(`Set the balance of ${user.username} to ${amount}.`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: setting ${user.username}s balance to ${amount}. Ran by ${message.author.username} | ${message.author.id}`);
	}

};


const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const blacklisted = require('../../utils/blacklistcheck');
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
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		if (!user) {
			user = message.author;
		}

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**`);
			return;
		}

		const blacklist = await blacklisted(message);
		if (blacklist == true) {
			message.reply('You\'ve been blacklisted');
			return;
		}

		await profile.findOneAndUpdate({ userID: user.id }, { $set: { skrilla: amount } });
		message.reply(`Set the balance of ${user.username} to ${amount}.`);
		console.log(`Command: setbalance was run by ${message.author.username} setting ${user.username}s balance to ${amount}`);
	}

};


const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');
const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const blacklisted = require('../../utils/blacklistcheck');

module.exports = class PurchaseBanCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'banpurchase',
			group: 'economy',
			memberName: 'banpurchase',
			description: 'Purchases one ban',
			guildOnly: true,
			aliases: ['buyban', 'purchaseban'],
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'BAN_MEMBERS',
			],
			args: [{
				key: 'user',
				prompt: 'Who would you like to ban with your Skrilla?',
				type: 'user',
			}],
		});
	}
	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		console.log(`Command: kick purchase was run by ${message.author.username} trying to kick ${user.username}`);

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

		const { guild } = message;

		const profileSearch = await profile.findOne({ userID: message.author.id });
		const balance = profileSearch.skrilla;
		const member = guild.members.cache.get(user.id);
		const price = 700000;

		let newBalance = 0;
		if (balance >= price) {
			if (member.bannable) {
				await member.user.send(`**${message.author.username}** has bought a ban on you.`);
				member.ban();
			}
			else {
				message.reply('This user isn\'t bannable');
				return;
			}
			newBalance = balance - price;
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newBalance } });
		}
		else {
			message.reply(`You don't have enough **skrilla** for this purchase, the price is **${price}** skrilla.`);
			return;
		}
		message.reply(`Banned ${user.username} for **${price}** Skrilla.`);

	}
};
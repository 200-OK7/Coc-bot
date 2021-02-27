const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');
const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');

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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: ban purchase as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: ban purchase but a profile for ${user.username} does not exist. Ran by ${message.author.username} | ${message.author.id}`);
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
				console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: ban purchase but ${user.username} is unbannable. Ran by ${message.author.username} | ${message.author.id}`);
				return;
			}
			newBalance = balance - price;
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newBalance } });
		}
		else {
			message.reply(`You don't have enough **skrilla** for this purchase, the price is **${price}** skrilla.`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: ban purchase but ${message.author.username} does not have enough currency. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}
		message.reply(`Banned ${user.username} for **${price}** Skrilla.`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: ban purchase on ${user.username}. Ran by ${message.author.username} | ${message.author.id}`);

	}
};
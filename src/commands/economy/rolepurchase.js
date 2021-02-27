/* eslint-disable no-shadow */
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');
const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class AddroleCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'rolepurchase',
			group: 'economy',
			memberName: 'rolepurchase',
			description: 'Purchases a role for a user',
			guildOnly: true,
			aliases: ['buyrole', 'purchaserole'],
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'MANAGE_ROLES',
			],
			args: [],
			argsType: 'multiple',
			argsSingleQuotes: true,
		});
	}
	async run(message, args) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		const targetUser = message.author;

		const profileExistanceCheck = await profile.find({ userID: targetUser.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**`);
			return;
		}

		const profileSearch = await profile.findOne({ userID: targetUser.id });
		const balance = profileSearch.skrilla;
		const price = 1000000000000;

		const roleName = args.join(' ');
		const { guild } = message;

		const role = guild.roles.cache.find((role) => {
			return role.name === roleName;
		});
		if (!role) {
			message.reply(`There is no role with this name "${roleName}`);
			return;
		}

		let newBalance = 0;
		const member = guild.members.cache.get(targetUser.id);
		if (balance >= price) {
			member.roles.add(role);
			newBalance = balance - price;
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newBalance } });
		}
		else {
			message.reply(`You don't have enough skrilla for this purchase. The price is **${price}** skrilla.`);
			return;
		}
		message.reply(`Purchased and added role "${roleName}"`);
		console.log(`Command: Add role was run by ${message.author.username}. ${roleName} added to ${member}`);
	}

};
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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: role purchase as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const targetUser = message.author;

		const profileExistanceCheck = await profile.find({ userID: targetUser.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: role purchase but ${message.author.username} does not have a profile. Ran by ${message.author.username} | ${message.author.id}`);
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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: role purchase but no role with the name ${roleName} was found. Ran by ${message.author.username} | ${message.author.id}`);
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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: role purchase but ${message.author.username} does not have enough currency. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}
		message.reply(`Purchased and added role "${roleName}"`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: role purchase, adding role ${roleName}. Ran by ${message.author.username} | ${message.author.id}`);
	}

};
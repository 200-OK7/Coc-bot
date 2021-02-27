const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');
const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class PurchaseKickCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'kickpurchase',
			group: 'economy',
			memberName: 'kickpurchase',
			description: 'Purchases one kick',
			guildOnly: true,
			aliases: ['buykick', 'purchasekick'],
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'KICK_MEMBERS',
			],
			args: [{
				key: 'user',
				prompt: 'Who would you like to kick with your Skrilla?',
				type: 'user',
			}],
		});
	}
	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: kick purchase as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: kick purchase but a profile for ${user.username} does not exist. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const { guild } = message;

		const profileSearch = await profile.findOne({ userID: message.author.id });
		const balance = profileSearch.skrilla;
		const member = guild.members.cache.get(user.id);

		let newBalance = 0;
		if (balance >= 500000) {
			if (member.kickable) {
				await member.user.send(`**${message.author.username}** has bought a kick on you.`);
				member.kick();
			}
			else {
				message.reply('This user is not kickable');
				console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: kick purchase but ${user.username} is unkickable. Ran by ${message.author.username} | ${message.author.id}`);
				return;
			}
			newBalance = balance - 500000;
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newBalance } });
		}
		else {
			message.reply('You do not have enough **skrilla** for this purchase, the price is **500000**');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: kick purchase but ${message.author.username} does not have enough currency. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}
		message.reply(`Kicked ${user.username} for **500000** Skrilla.`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: kick purchase on ${user.username}. Ran by ${message.author.username} | ${message.author.id}`);

	}
};
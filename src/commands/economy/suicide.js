const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class SuicideCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'suicide',
			group: 'economy',
			memberName: 'suicide',
			description: 'Life is no more',
			guildOnly: true,
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
		});
	}
	async run(message) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: suicide as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: message.author.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: suicide but ${message.author.username} does not have a profile. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: 0 } });
		message.reply(` ${message.author.username} died, their skrilla balance is now **0.**`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: suicide. Ran by ${message.author.username} | ${message.author.id}`);
	}

};


const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

// This command only applies to the seperate verification system for the Developer guild.

module.exports = class ServerAllowCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'allowserver',
			group: 'mod',
			ownerOnly: true,
			hidden: true,
			aliases: ['serverallow'],
			memberName: 'allowserver',
			description: 'Allows a user into the Dev guild',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Whos allow status would you like to change',
				type: 'user',
				default: '',
			}, {
				key: 'allowstatus',
				prompt: 'What would you like to set their allow status too?',
				type: 'boolean',
			}],
		});
	}
	async run(message, { user, allowstatus }) {
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

		await profile.findOneAndUpdate({ userID: user.id }, { $set: { devGuildList: allowstatus } });
		message.reply(`Set the allow server status of ${user.username} to ${allowstatus}.`);

		console.log(`Command serverallow was run by ${message.author.username} setting ${user.username}s serverallow status to ${allowstatus}`);
	}

};


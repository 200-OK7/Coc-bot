const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const blacklisted = require('../../utils/blacklistcheck');
const { prefix } = require('../../../config.json');

module.exports = class SuicideCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'suicide',
			group: 'economy',
			memberName: 'suicide',
			description: 'Life is no more',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
		});
	}
	async run(message) {
		console.log(`Command: suicide was run by ${message.author.username}`);

		const profileExistanceCheck = await profile.find({ userID: message.author.id });

		if (!profileExistanceCheck.length) {
			message.reply(`You don't have a profile, you'll need to run **${prefix}profilecreate**`);
			return;
		}

		const blacklist = await blacklisted(message);
		if (blacklist == true) {
			message.reply('You\'ve been blacklisted');
			return;
		}

		await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: 0 } });
		message.reply(` ${message.author.username} died, their skrilla balance is now **0.**`);

	}

};


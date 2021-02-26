const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class BlacklistCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'blacklist',
			group: 'mod',
			aliases: ['excommunicate'],
			memberName: 'blacklist',
			description: 'Blacklists a user from commands',
			ownerOnly: true,
			hidden: true,
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Whos blacklist status would you like to change',
				type: 'user',
				default: '',
			}, {
				key: 'blstatus',
				prompt: 'What would you like to set their blacklist status too?',
				type: 'boolean',
			}],
		});
	}
	async run(message, { user, blstatus }) {
		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They/You don't have a profile, they'll/You'll need to run **${prefix}profilecreate**`);
			return;
		}

		if (!user) {
			user = message.author;
		}

		await profile.findOneAndUpdate({ userID: user.id }, { $set: { blacklisted: blstatus } });
		message.reply(`Set the blacklist status of ${user.username} to ${blstatus}.`);

		console.log(`Command: blacklist was run by ${message.author.username} setting ${user.username}s blacklist status to ${blstatus}`);
	}

};


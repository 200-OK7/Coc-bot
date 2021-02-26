const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const blacklisted = require('../../utils/blacklistcheck');
const { prefix } = require('../../../config.json');

module.exports = class RobCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'rob',
			group: 'economy',
			memberName: 'rob',
			description: 'Robs a users balance',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30,
			},
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [
				{
					key: 'user',
					prompt: 'Who would you like to rob?',
					type: 'user',
				},
			],
			argsType: 'single',
		});
	}
	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**.`);
			return;
		}

		const blacklist = await blacklisted(message);
		if (blacklist == true) {
			message.reply('You\'ve been blacklisted.');
			return;
		}

		if (user == message.author) {
			message.reply('You can\'t rob yourself.');
			return;
		}

		if (user.id == '805454248527659038') {
			message.reply('Can\'t rob me (^:');
			return;
		}

		const profileSearch = await profile.findOne({ userID: user.id });
		const skrilla = profileSearch.skrilla;

		const AuthorSearch = await profile.findOne({ userID: message.author.id });
		const AuthorSkrilla = AuthorSearch.skrilla;
		const robAmount = Math.floor((Math.random() * skrilla) + 1);

		if (robAmount < 0) {
			message.reply('You can\'t rob a negative amount of money.');
			return;
		}
		const newAuthorBalance = AuthorSkrilla + robAmount;

		const newBalance = skrilla - robAmount;

		if (skrilla <= 0) {
			message.reply('This user is too poor.');
			return;
		}
		else {
			await profile.findOneAndUpdate({ userID: user.id }, { $set: { skrilla: newBalance } });
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newAuthorBalance } });
			message.reply(`You stole **${robAmount}** skrilla from ${user.username}.`);
		}
		console.log(`Command: Rob was run by ${message.author.username} robbing ${user.username} for ${robAmount}`);
	}

};


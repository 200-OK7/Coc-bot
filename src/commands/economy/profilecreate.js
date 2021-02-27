const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');

module.exports = class ProfileCreateCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'profilecreate',
			group: 'economy',
			memberName: 'profilecreate',
			description: 'Creates a profile in the mongoDB database',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Whos profile would you like to create?',
				type: 'user',
			}],
		});
	}
	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: profile create as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const resultsearch = await profile.find({ userID: user.id });

		if (resultsearch.length) {
			message.reply('They already have a profile.');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: profile create but ${user.username} already has a profile. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}
		else {
			const userprofile = new profile({
				username: user.username,
				devGuildList: false,
				userID: user.id,
				skrilla: 0,
				bankamount: 0,
			}); userprofile.save();
		}

		message.reply(`Profile created for ${user.username}`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: profile create for ${user.username}. Ran by ${message.author.username} | ${message.author.id}`);
	}

};


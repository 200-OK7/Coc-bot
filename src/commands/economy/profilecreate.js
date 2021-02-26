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
			return;
		}


		const resultsearch = await profile.find({ userID: user.id });

		if (resultsearch.length) {
			message.reply('They already have a profile.');
			return;
		}
		else {
			const userprofile = new profile({
				username: user.username,
				devGuildList: false,
				userID: user.id,
				blacklisted: false,
				skrilla: 0,
				bankamount: 0,
			}); userprofile.save();
		}

		console.log(`Command: Profile create was run by ${message.author.username} creating a profile for ${user.username}`);
		message.reply(`Profile created for ${user.username}`);
	}

};


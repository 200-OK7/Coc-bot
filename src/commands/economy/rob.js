const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
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
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: rob as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They don't have a profile, they'll need to run **${prefix}profilecreate**.`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: rob but ${user.username} does not have a profile. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		if (user == message.author) {
			message.reply('You can\'t rob yourself.');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: Rob but ${user.username} tried to rob themselves. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		if (user.id == '805454248527659038') {
			message.reply('Can\'t rob me (^:');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: rob but ${user.username} tried to rob the bot. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileSearch = await profile.findOne({ userID: user.id });
		const skrilla = profileSearch.skrilla;

		const AuthorSearch = await profile.findOne({ userID: message.author.id });
		const AuthorSkrilla = AuthorSearch.skrilla;
		const robAmount = Math.floor((Math.random() * skrilla) + 1);

		if (robAmount < 0) {
			message.reply('You can\'t rob a negative amount of money.');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: rob but a negative rob amount was found. Ran by ${message.author.username} | ${message.author.id}`);

			return;
		}
		const newAuthorBalance = AuthorSkrilla + robAmount;

		const newBalance = skrilla - robAmount;

		if (skrilla <= 0) {
			message.reply('This user is too poor.');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: rob but ${user.username} does not have enough currency. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}
		else {
			await profile.findOneAndUpdate({ userID: user.id }, { $set: { skrilla: newBalance } });
			await profile.findOneAndUpdate({ userID: message.author.id }, { $set: { skrilla: newAuthorBalance } });
			message.reply(`You stole **${robAmount}** skrilla from ${user.username}.`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: rob on ${user.username} stealing ${robAmount}. Ran by ${message.author.username} | ${message.author.id}`);
		}
	}

};


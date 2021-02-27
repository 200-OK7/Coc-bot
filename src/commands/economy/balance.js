const profile = require('../../schemas/profile-schema');
const guildProfile = require('../../schemas/guild-schema');
const commando = require('discord.js-commando');
const { prefix } = require('../../../config.json');

module.exports = class BalanceCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'balance',
			group: 'economy',
			aliases: ['bal'],
			memberName: 'balance',
			guildOnly: true,
			description: 'Gets a users balance',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Whose balance would you like to check?',
				type: 'user',
				default: '',
			}],
		});
	}
	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: balance as blacklisted. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		if (!user) {
			user = message.author;
		}

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They/You don't have a profile, they'll/You'll need to run **${prefix}profilecreate**`);
			console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Tried to run command: balance but a profile for ${user.username} does not exist. Ran by ${message.author.username} | ${message.author.id}`);
			return;
		}

		const profileSearch = await profile.findOne({ userID: user.id });

		const skrilla = profileSearch.skrilla;
		const bankSkrilla = profileSearch.bankamount;


		message.channel.send(`__${user.username}__ has\n**${skrilla}** in their wallet\n**${bankSkrilla}** in their bank`);
		console.log(`Guild: ${message.guild.name} | ${message.guild.id}. Ran command: balance checking for ${user.username}s balance. Ran by ${message.author.username} | ${message.author.id}`);
	}


};


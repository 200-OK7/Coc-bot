const profile = require('../../schemas/profile-schema');
const commando = require('discord.js-commando');
const blacklisted = require('../../utils/blacklistcheck');
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
		if (!user) {
			user = message.author;
		}

		console.log(`Command balance was run by ${message.author.username}: Checking ${user.username}s balance`);

		const profileExistanceCheck = await profile.find({ userID: user.id });

		if (!profileExistanceCheck.length) {
			message.reply(`They/You don't have a profile, they'll/You'll need to run **${prefix}profilecreate**`);
			return;
		}

		const blacklistCheck = await blacklisted(message);
		if (blacklistCheck == true) {
			message.reply('You\'ve been blacklisted');
			return;
		}

		const profileSearch = await profile.findOne({ userID: user.id });

		const skrilla = profileSearch.skrilla;
		const bankSkrilla = profileSearch.bankamount;


		message.channel.send(`__${user.username}__ has\n**${skrilla}** in their wallet\n**${bankSkrilla}** in their bank`);
	}


};


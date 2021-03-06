const commando = require('discord.js-commando');
const fetch = require('node-fetch');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class InsultCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'insult',
			group: 'pvp',
			memberName: 'insult',
			aliases: ['evilinsult'],
			description: 'Insults someone',
			guildOnly: true,
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Who would you like to insult',
				type: 'string',
			}],
		});
	}

	async run(msg, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: msg.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			msg.reply('This guild has been blacklisted');
			return;
		}

		const { insult } = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json').then(response => response.json());

		msg.channel.send(`${user}. ${insult}`);

		console.log(`Command: Insult was run by ${msg.author.username}.`);

	}

};
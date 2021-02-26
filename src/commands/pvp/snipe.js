const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');
const snipeReasons = ['They fall into a pit of lava and die.', 'The bullet misses and reflects back to you! You die like the fool you are.', 'The bullet hits their vital organs.', 'The gun jams, oops.',
	'You miss, idiot.', 'You hit them dead in the eyes.', 'The bullet reflects back to you, but then back to them!'];


module.exports = class SnipeCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'snipe',
			group: 'pvp',
			memberName: 'snipe',
			aliases: ['sniper'],
			description: 'Snipes a user',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Who would you like to snipe?',
				type: 'user',
			}],
			argsType: 'single',
			argsSingleQuotes: true,
		});
	}
	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		if (user == message.author) {
			message.reply('Why are you trying to snipe yourself?');
			return;
		}

		const snipe = snipeReasons[Math.floor(Math.random() * snipeReasons.length)];
		message.channel.send(`${message.author.username} snipes ${user.username}, ${snipe} `);
		console.log(`Command: Snipe was run by ${message.author.username} targeting user ${user.username}.`);

	}

};
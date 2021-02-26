const commando = require('discord.js-commando');

module.exports = class KickCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'mod',
			memberName: 'kick',
			aliases: ['boot'],
			description: 'Kicks a user from the guild',
			userPermissions: [
				'KICK_MEMBERS',
			],
			clientPermissions: [
				'KICK_MEMBERS',
			],
			argsType: 'single',
		});
	}

	async run(message) {
		const target = message.mentions.users.first();
		if (!target) {
			message.channel.send('Who am I supposed to kick?');
			return;
		}

		const { guild } = message;

		const member = guild.members.cache.get(target.id);
		if (member.kickable) {
			member.kick();
			message.channel.send(`${member} has been kicked.`);
		}
		else {
			message.channel.send('I can\'t kick this user.');

		}
		console.log(`Command: kick was run by ${message.author.username}. ${member} was kicked from ${guild.name}`);
	}


};
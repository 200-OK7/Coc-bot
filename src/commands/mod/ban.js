const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class BanCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'mod',
			memberName: 'ban',
			description: 'Bans a user from the guild',
			aliases: ['hackban'],
			userPermissions: [
				'BAN_MEMBERS',
			],
			clientPermissions: [
				'BAN_MEMBERS',
			],
			argsType: 'single',
		});
	}

	async run(message) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		const target = message.mentions.users.first();
		if (!target) {
			message.channel.send('Who am I supposed to ban?');
			return;
		}

		const { guild } = message;

		const member = guild.members.cache.get(target.id);
		if (member.bannable) {
			member.ban();
			message.channel.send(`${member} has been banned.`);
		}
		else {
			message.channel.send('I can\'t ban this user.');
		}
		console.log(`Command: Ban was run by ${message.author.username}. ${member} was banned from ${guild.name}`);

	}


};

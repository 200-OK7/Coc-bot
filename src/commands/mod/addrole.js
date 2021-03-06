/* eslint-disable no-shadow */
const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class AddroleCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'addrole',
			group: 'mod',
			memberName: 'addrole',
			description: 'Adds a role to a user',
			guildOnly: true,
			aliases:['roleadd', 'plusrole'],
			userPermissions: [
				'MANAGE_ROLES',
			],
			clientPermissions: [
				'MANAGE_ROLES',
			],
			args: [],
			argsType: 'multiple',
			argsSingleQuotes: true,
		});
	}
	async run(msg, args) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: msg.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			msg.reply('This guild has been blacklisted');
			return;
		}

		const targetUser = msg.mentions.users.first();


		if (!targetUser) {
			msg.reply('You need to give a user');
			return;
		}


		args.shift();

		const roleName = args.join(' ');
		const { guild } = msg;

		const role = guild.roles.cache.find((role) => {
			return role.name === roleName;
		});
		if (!role) {
			msg.reply(`There is no role with this name "${roleName}"`);
			return;
		}

		const member = guild.members.cache.get(targetUser.id);
		member.roles.add(role);

		msg.channel.send(`Added role "${roleName}" to "${member}"`);
		console.log(`Command: Added role was run, ${roleName} added to ${member}`);
	}

};
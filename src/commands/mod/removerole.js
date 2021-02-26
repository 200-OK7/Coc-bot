/* eslint-disable no-shadow */
const commando = require('discord.js-commando');

module.exports = class RemoveRoleCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'removerole',
			group: 'mod',
			memberName: 'removerole',
			description: 'Removes a role from a user',
			aliases: ['roleremove', 'subtractrole'],
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
	async run(message, args) {
		const targetUser = message.mentions.users.first();


		if (!targetUser) {
			message.reply('You need to give a user.');
			return;
		}


		args.shift();

		const roleName = args.join(' ');
		const { guild } = message;

		const role = guild.roles.cache.find((role) => {
			return role.name === roleName;
		});
		if (!role) {
			message.reply(`There is no role with this name "${roleName}"`);
			return;
		}

		const member = guild.members.cache.get(targetUser.id);
		member.roles.remove(role);

		message.reply(`Removed role "${roleName}"`);
		console.log(`Command: Remove role was run by ${message.author.username}. ${roleName} removed from ${member}`);
	}

};
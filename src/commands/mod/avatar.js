const commando = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class AvatarCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			group: 'misc',
			memberName: 'avatar',
			aliases: ['pfp'],
			description: 'Get a users avatar',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [
				{
					key: 'user',
					prompt: 'Whos avatar would you like to get?',
					type: 'user',
					default: '',
				},
			],
			argsType: 'single',
		});
	}

	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		if (!user) {
			user = message.author;
		}

		const avatarURL = user.displayAvatarURL({ size: 4096, dynamic: true });

		const embed = new MessageEmbed()
			.setColor('#E54449')
			.setTitle(`Here is ${user.username}'s avatar`)
			.setImage(avatarURL);

		message.channel.send(embed);
		console.log(`Command: Avatar was run for by ${message.author.username} searching for ${user.username}'s avatar`);
	}

};
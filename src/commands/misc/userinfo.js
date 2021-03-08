/* eslint-disable no-mixed-spaces-and-tabs */
const commando = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const guildProfile = require('../../schemas/guild-schema');

module.exports = class FeedCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'userinfo',
			group: 'misc',
			memberName: 'userinfo',
			aliases: ['whois', 'ui'],
			description: 'Gets info on a user',
			guildOnly: true,
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Who would you like to get the info of?',
				type: 'user',
			}],
		});
	}
	async run(message, { user }) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		if (!user) {
			user == message.author;
		}

		const myInfo = new MessageEmbed()
			.setAuthor('User: ' + user.username, user.displayAvatarURL())
			.addField('Is Bot', user.bot, true)
			.addField('Created At', user.createdAt, true)
			.addField('Discrim', user.discriminator, true)
			.addField('ID', user.id, true)
			.addField('Tag', user.tag, true)
			.addField('Username', user.username, true)
			.setColor(15025225);


		message.channel.send(myInfo);
	}


};
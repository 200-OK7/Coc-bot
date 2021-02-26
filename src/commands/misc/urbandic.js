const commando = require('discord.js-commando');
const guildProfile = require('../../schemas/guild-schema');
const querystring = require('querystring');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = class UrbanDictionaryCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			group: 'misc',
			memberName: 'urban',
			aliases: ['urbandictionary', 'dictionary'],
			description: 'Searches urban dictionary',
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [],
		});
	}

	async run(message, args) {
		const guildBlacklistCheck = await guildProfile.findOne({ guildId: message.guild.id });
		if(guildBlacklistCheck.guildBlacklisted === true) {
			message.reply('This guild has been blacklisted');
			return;
		}

		const query = querystring.stringify({ term: args });

		if (!args.length) {
			return message.channel.send('You need to supply a search term.');
		}


		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
		if (!list.length) {
			return message.channel.send(`No results found for **${args}**.`);
		}

		const [answer] = list;

		const clean = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);


		const embed = new MessageEmbed()
			.setColor('#EFFF00')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: clean(answer.definition, 1024) },
				{ name: 'Example', value: clean(answer.example, 1024) },
				{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
			);

		message.channel.send(embed);
		console.log(`Command: Urban Dictionary was run by ${message.author.username} searching for ${args}`);
	}

};
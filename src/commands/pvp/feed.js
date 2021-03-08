const commando = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const food = [ '🍇',
	'🍈',
	'🍉',
	'🍊',
	'🍋',
	'🍌',
	'🍍',
	'🥭',
	'🍎',
	'🍏',
	'🍐',
	'🍑',
	'🍒',
	'🍓',
	'🥝',
	'🍅',
	'🥥',
	'🥑',
	'🍆',
	'🥔',
	'🥕',
	'🌽',
	'🌶️',
	'🥒',
	'🥬',
	'🥦',
	'🧄',
	'🧅',
	'🍄',
	'🥜',
	'🌰',
	'🍞',
	'🥐',
	'🥖',
	'🥨',
	'🥯',
	'🥞',
	'🧇',
	'🧀',
	'🍖',
	'🍗',
	'🥩',
	'🥓',
	'🍔',
	'🍟',
	'🍕',
	'🌭',
	'🥪',
	'🌮',
	'🌯',
	'🥙',
	'🧆',
	'🥚',
	'🍳',
	'🥘',
	'🍲',
	'🥣',
	'🥗',
	'🍿',
	'🧈',
	'🧂',
	'🥫',
	'🍱',
	'🍘',
	'🍙',
	'🍚',
	'🍛',
	'🍜',
	'🍝',
	'🍠',
	'🍢',
	'🍣',
	'🍤',
	'🍥',
	'🥮',
	'🍡',
	'🥟',
	'🥠',
	'🥡',
	'🦪',
	'🍦',
	'🍧',
	'🍨',
	'🍩',
	'🍪',
	'🎂',
	'🍰',
	'🧁',
	'🥧',
	'🍫',
	'🍬',
	'🍭',
	'🍮',
	'🍯',
	'🍼',
	'🥛',
	'☕',
	'🍵',
	'🍶',
	'🍾',
	'🍷',
	'🍸',
	'🍹',
	'🍺',
	'🍻',
	'🥂',
	'🥃',
	'🥤',
	'🧃',
	'🧉',
	'🧊',
	'🐢'];
const guildProfile = require('../../schemas/guild-schema');

module.exports = class FeedCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'feed',
			group: 'pvp',
			memberName: 'feed',
			aliases: ['food', 'eat'],
			description: 'Feeds a user',
			guildOnly: true,
			userPermissions: [
				'SEND_MESSAGES',
			],
			clientPermissions: [
				'SEND_MESSAGES',
			],
			args: [{
				key: 'user',
				prompt: 'Who would you like to feed?',
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

		console.log(user.username);
		const foodItem = food[Math.floor(Math.random() * food.length)];

		const foodText = `${message.author.username} forces ${user.username} to eat ${foodItem}`;
		const embed = new MessageEmbed()
			.setColor('#FF0000')
			.setTitle(foodText);

		message.channel.send(embed);
		console.log(`Command: Feed was run by ${message.author.username}`);
	}


};
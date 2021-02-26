const Commando = require('discord.js-commando');
const { token, owner, prefix, requestsGroupDesc, requestsGroupName } = require ('../config.json');
const client = new Commando.Client({
	owner: owner,
	commandPrefix: prefix,
});

client.mongoose = require('./utils/mongodb.js');
client.mongoose.init();


client.login(token);

const path = require('path');

client.registry
	.registerGroups([
		['mod', 'Moderation commands'],
		['misc', 'Miscellaneous commands'],
		['pvp', 'Player vs Player commands/User related commands'],
		['animals', 'Animal related commands'],
		['economy', 'Economy commands'],
		[requestsGroupName, requestsGroupDesc],
	])

	.registerDefaults()

	.registerCommandsIn(path.join(__dirname, 'commands'));


client.on('ready', async () => {
	console.log(`Bot has logged in as ${client.user.tag}`);

	client.user.setActivity('collapse of society', { type: 'WATCHING' });
});

const Commando = require('discord.js-commando');
const { token, owner, prefix, requestsGroupDesc, requestsGroupName } = require ('../config.json');
const guildProfile = require('../src/schemas/guild-schema');
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

client.on('guildCreate', async (guild) => {
	console.log(`Joined guild ${guild.name}`);

	const existanceCheck = await guildProfile.find({ guildId: guild.id });

	if (existanceCheck.length) {
		console.warn(`Guild ${guild.name} has an existing profile, this is a database error.`);
		return;
	}
	else {
		const newGuildProfile = new guildProfile({
			guildName: guild.name,
			guildId: guild.id,
			guildBlacklisted: false,
		}); newGuildProfile.save();
	}
});

client.on('guildDelete', async (guild) => {
	console.log(`Left guild ${guild.name}`);

	const existanceCheck = await guildProfile.find({ guildId: guild.id });

	if (!existanceCheck.length) {
		console.warn(`Guild ${guild.name} doesn't have a profile, this is a database error.`);
		return;
	}
	else {
		await guildProfile.findOneAndDelete({ guildId: guild.id });
	}
});
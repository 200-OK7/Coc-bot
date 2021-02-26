const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const reqBoolean = {
	type: Boolean,
	required: true,
};

const guildSchema = mongoose.Schema({
	guildName: reqString,
	guildId: reqString,
	guildBlacklisted: reqBoolean,
});

module.exports = mongoose.model('guild', guildSchema);
const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const reqBoolean = {
	type: Boolean,
	required: true,
};

const reqNumber = {
	type: 'Number',
	required: true,
};

const profileSchema = mongoose.Schema({
	username: reqString,
	devGuildList: reqBoolean,
	userID: reqString,
	blacklisted: reqBoolean,
	skrilla: reqNumber,
	bankamount: reqNumber,
});

module.exports = mongoose.model('profile', profileSchema);
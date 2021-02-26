const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const requestSchema = mongoose.Schema({
	mediaName: reqString,
	mediaDescription: reqString,
	mediaType: reqString,
	requestAuthor: reqString,
	approvalStatus: Boolean,
});

module.exports = mongoose.model('request', requestSchema);
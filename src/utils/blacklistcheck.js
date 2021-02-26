const profile = require('../schemas/profile-schema');

module.exports = async (message) => {

	const blacklisted = await profile.findOne({ userID: message.author.id });
	if (blacklisted.blacklisted == true) {
		return true;
	}
	else {
		return false;
	}
};
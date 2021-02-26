const mongoose = require('mongoose');
const { mongoDBpath } = require('../../config.json');

module.exports = {
	init: () => {
		const dbOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			poolSize: 5,
			connectTimeoutMS: 10000,
			family: 4,
		};

		mongoose.connect(mongoDBpath, dbOptions);
		mongoose.set('useFindAndModify', false);
		mongoose.Promise = global.Promise;

		mongoose.connection.on('connected', () => {
			console.log('Mongoose has connected');
		});

		mongoose.connection.on('err', err => {
			console.error(`Mongoose has a connection error: \n${err.stack} `);
		});

		mongoose.connection.on('disconnected', () => {
			console.warn('Mongoose has lost connection');
		});
	},
};
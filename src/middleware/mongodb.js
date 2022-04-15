const mongoose = require('mongoose');
const timestamp = require('../misc/timestamp.js');
const toJSON = require('../misc/toJSON.js');
const paginate = require('mongoose-paginate-v2');
const config = require('config');

class Mongodb {
	constructor({ host, user, password, dbName, authenticationDatabase }) {
		mongoose.plugin(timestamp);
		mongoose.plugin(toJSON);
		mongoose.plugin(paginate);

		this.mongoose = mongoose;
		this.host = host;
		this.user = user;
		this.password = password;
		this.dbName = dbName;
		this.authenticationDatabase = authenticationDatabase;
	}

	async open() {
		await mongoose.connect(config.db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}

	async close() {
		await mongoose.connection.close();
		await mongoose.disconnect();
	}

	async drop() {
		await mongoose.connection.dropDatabase();
	}

	set(config) {
		const { host, user, password, dbName, authenticationDatabase } = config;
		this.host = host;
		this.user = user;
		this.password = password;
		this.dbName = dbName;
		this.authenticationDatabase = authenticationDatabase;
	}
}

module.exports = new Mongodb(config);

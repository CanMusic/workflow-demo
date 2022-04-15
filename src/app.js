const config = require('config');
const moment = require('moment');
const mongodb = require('./middleware/mongodb.js');
const webServer = require('./webserver.js');
const { name, version } = require('../package.json');

class App {
    constructor() {
        this.uptime = moment().unix();
        this.name = name;
        this.version = version;
        this.mongoose = mongodb.mongoose;
        this.webServer = webServer;
    }

    async open() {
        console.log(`ver: ${this.version}, uptime: ${moment().format()}`);
        await this.openDatabase();
        await this.webServer.open();
    }

    async close() {
        await this.webServer.close();
        await this.closeDatabase();
        console.log(`app closed at: ${moment().format()}`);
    }

    async openDatabase() {
        try {
            await mongodb.open();
            console.log(`mongodb connected OK: ${config.db}`);
        } catch (error) {
            console.log('mongodb connected FAILED: ', error);
        }
    }

    async closeDatabase() {
        await mongodb.close();
        console.log('mongodb closed.');
    }
}

module.exports = new App();

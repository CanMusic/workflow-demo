const config = require('config');
const moment = require('moment');
const { nanoid } = require('nanoid');
const mongodb = require('./middleware/mongodb.js');
const webServer = require('./Webserver.js');
const { name, version } = require('../package.json');
const { Event } = require('./models/Event');
const { Form } = require('./models/Form');
const { Resource, User, Room, Desk } = require('./models/Resource');
class App {
    constructor() {
        this.uptime = moment().unix();
        this.name = name;
        this.version = version;
        this.mongoose = mongodb.mongoose;
        this.webServer = webServer;
    }

    async initDB() {
        await Event.deleteMany({});
        await Form.deleteMany({});
        await Resource.deleteMany({});

        await User.create({
            name: 'admin',
            description: '管理员',
            email: 'admin@shgbit.com',
            mobile: 13816545931,
            avatar: 'https://himg.bdimg.com/sys/portraitn/item/a990626561746d616e6961313233e403',
        });
        await Room.create({
            name: 'Room101',
            code: 'A101',
            description: '101会议室',
            building: '宝石园20号楼',
            floor: '24楼',
            capacity: 30,
            deviceTag: '电子白板,投影机',
            bookable: true,
            needAudit: true,
        });
        await Room.create({
            name: 'Room202',
            code: 'A202',
            description: '202会议室',
            building: '宝石园20号楼',
            floor: '24楼',
            capacity: 5,
            deviceTag: '电视机',
            bookable: true,
            needAudit: false,
        });
        await Desk.create({
            name: '工位1',
            description: '工位1',
            building: '宝石园20号楼',
            floor: '24楼',
            bookable: true,
            diagram: '平面图',
            x: 100,
            y: 100,
        });
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
            await this.initDB();
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

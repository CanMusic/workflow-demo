const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
let { Room, User, Desk } = require('../models/Resource');

class ResourceService {
    constructor() {
    }

    async findAllRooms() {
        return await Room.find({});
    }

    async findRoomByCode(code) {
        return await Room.findOne({ code });
    }

    async findRoomById(id) {
        return await Room.findById(id);
    }

    async findAllUsers() {
        return await User.find({});
    }

    async findAllDesks() {
        return await Desk.find({});
    }
}

module.exports = new ResourceService();

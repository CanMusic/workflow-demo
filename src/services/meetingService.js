const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
const { Meeting } = require('../models/Event.js');

// readonly, write在formservice
class MeetingService {
    constructor() {
    }

    async findAllMeetings() {
        return await Meeting.find({}).populate({ path: 'room', select: 'name code' });
    }

    async findMeetingById(id) {
        return await Meeting.findById(id).populate({ path: 'room', select: 'name code' });
    }
}

module.exports = new MeetingService();
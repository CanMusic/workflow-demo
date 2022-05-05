const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
let { CreateMeetingForm } = require('../models/Form');

class MeetingFormService {
    constructor() {
    }

    async findAll() {
        return await CreateMeetingForm.find({});
    }

    async findById(id) {
        return await CreateMeetingForm.findById(id);
    }

    async findCreateMeetingFormByCode(code) {
        return await CreateMeetingForm.findOne({ code });
    }
}

module.exports = new MeetingFormService();
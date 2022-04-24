const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
let { Form, CreateMeetingForm } = require('../models/Form');

class FormService {
    constructor() {
    }

    async findAll() {
        return await Form.find({});
    }

    async findById(id) {
        return await Form.findById(id);
    }

    async findCreateMeetingFormByCode(code) {
        return await CreateMeetingForm.findOne({ code });
    }

    async saveCreateMeetingForm(data) {
        return await CreateMeetingForm.create({
            title: data.title,
            beginAt: data.beginAt,
            endAt: data.endAt,
            room: data.room,
            createdBy: 'cwj',
            needAudit: true
        });
    }
}

module.exports = new FormService();
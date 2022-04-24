const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
const { Meeting } = require('../models/Event.js');
let { CreateMeetingForm } = require('../models/Form');

class MeetingService {
    constructor() {
    }

    async findAllMeetings() {
        return await Meeting.find({});
    }

    async findMeetingById(id) {
        return await Meeting.findById(id);
    }

    async findCreateMeetingFormByCode(code) {
        return await CreateMeetingForm.findOne({ code });
    }

    async saveForm(data) {
        return await CreateMeetingForm.create({
            title: data.title,
            beginAt: data.beginAt,
            endAt: data.endAt,
            room: 'A101',
            createdBy: 'cwj',
            needAudit: true
        });
    }

    async audit(form) {
        let event = await Meeting.create({
            title: form.title,
            beginAt: form.beginAt,
            endAt: form.endAt,
            room: form.room,
            enabled: false,
            state: 'audit',
            createdBy: form.createdBy,
            ctx: { formCode: form.code }
        });

        form.ctx.eventId = event._id;
        await form.save();

        return event;
    }

    async success(form) {
        let eventId = form.ctx.eventId;
        let event = await Meeting.findById(eventId);
        event.enabled = true;
        event.state = 'success';
        event = await event.save();

        await form.save();

        return event;
    }

    async refuse(form) {
        let eventId = form.ctx.eventId;
        let event = await Meeting.findById(eventId);
        event.enabled = false;
        event.state = 'refuse';
        event = await event.save();

        await form.save();

        return event;
    }
}

module.exports = new MeetingService();
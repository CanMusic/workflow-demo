const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
const { Meeting } = require('../models/Event.js');

class MeetingService {
    constructor() {
    }

    async findAllMeetings() {
        return await Meeting.find({}).populate({ path: 'room', select: 'name code' });
    }

    async findMeetingById(id) {
        return await Meeting.findById(id).populate({ path: 'room', select: 'name code' });
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

        return event;
    }

    async success(form) {
        let eventId = form.ctx.eventId;
        let event = await Meeting.findById(eventId);
        event.enabled = true;
        event.state = 'success';
        event = await event.save();

        return event;
    }

    async refuse(form) {
        let eventId = form.ctx.eventId;
        let event = await Meeting.findById(eventId);
        event.enabled = false;
        event.state = 'refuse';
        event = await event.save();

        return event;
    }
}

module.exports = new MeetingService();
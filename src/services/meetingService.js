const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
const Event = require('../models/Event.js');
const Form = require('../models/Form.js');

class MeetingService {
    constructor() {
    }

    async findEventById(id) {
        return await Event.findById(id);
    }

    async findFormByCode(code) {
        return await Form.findOne({ code });
    }

    async audit(form) {
        let event = await Event.create({
            title: form.title,
            beginAt: form.beginAt,
            endAt: form.endAt,
            enabled: false,
            state: 'audit',
            createdBy: form.createdBy,
            ctx: { formCode: form.code }
        });
        form.ctx.eventId = event._id;

        await Form.create({
            code: form.code,
            type: 'createMeeting',
            content: JSON.stringify(form),
            ctx: { eventId: event._id }
        });

        return event;
    }

    async success(form) {
        let eventId = form.ctx.eventId;
        let event = await Event.findById(eventId);
        event.enabled = true;
        event.state = 'success';
        event = await event.save();

        let _form = await Form.findOne({ code: form.code });
        _form.content = JSON.stringify(form);
        _form.save();

        return event;
    }

    async refuse(form) {
        let eventId = form.ctx.eventId;
        let event = await Event.findById(eventId);
        event.enabled = false;
        event.state = 'refuse';
        event = await event.save();

        let _form = await Form.findOne({ code: form.code });
        _form.content = JSON.stringify(form);
        _form.save();

        return event;
    }
}

module.exports = new MeetingService();
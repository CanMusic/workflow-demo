const { result } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
let Calendar = require('../models/Calendar');
let { Resource } = require('../models/Resource');

class CalendarService {
    constructor() {
    }

    async findAll() {
        return await Calendar.find({}).populate({ path: 'events', select: 'code beginAt endAt enabled' });
    }

    async findById(id) {
        return await Calendar.findById(id).populate({ path: 'events', select: 'code beginAt endAt enabled' });
    }

    async hitTest({ calendarId, beginAt, endAt }) {
        let calendar = await Calendar.findById(calendarId).populate({ path: 'events', select: 'code beginAt endAt enabled' });
        let hitTest = false;
        _.each(calendar.events, p => {
            if (beginAt >= p.beginAt && beginAt <= p.endAt) {
                hitTest = true;
                return false;
            }
            if (endAt >= p.beginAt && endAt <= p.endAt) {
                hitTest = true;
                return false;
            }
        });
        return hitTest;
    }

    async findOrCreateByResoucesId(id) {
        let resource = await Resource.findById(id);
        let calendarId = resource.calendar;
        if (calendarId) {
            return await Calendar.findById(calendarId);
        }
        else {
            let calendar = await this.create({ name: `${resource.name}的日历` })
            resource.calendar = calendar;
            await resource.save();
            return calendar;
        }
    }

    async create(data) {
        return await Calendar.create({
            name: data.name,
        });
    }
}

module.exports = new CalendarService();
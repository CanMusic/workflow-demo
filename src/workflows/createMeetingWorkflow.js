const _ = require('lodash');
const moment = require('moment');
let meetingService = require('../services/MeetingService');
let resourceService = require('../services/ResourceService');
let calendarService = require('../services/CalendarService');
let notifyService = require('../services/NotifyService');
const Workflow = require('./Workflow');
const ServerError = require('../misc/ServerError');
let { CreateMeetingForm } = require('../models/Form');
let { Meeting } = require('../models/Event');
const Calendar = require('../models/Calendar');

// states: [init, audit, success, refused]
// init -> success
// init -> audit
// audit -> success
// audit -> refused
class CreateMeetingWorkflow extends Workflow {
    constructor(form) {
        super();
        if (!form) throw new ServerError(403, '缺少表单');

        this.fsm = [
            { action: 'audit', from: 'init', to: 'audit', fire: this._onAudit },
            { action: 'create', from: 'init', to: 'success', fire: this._onSuccess },
            { action: 'pass', from: 'audit', to: 'success', fire: this._onPass },
            { action: 'refuse', from: 'audit', to: 'refused', fire: this._onRefused },
        ];
        this.form = form;
        this.room = null;
    }

    async _fetchForm() {
        if (this.form.id) {
            let form = await CreateMeetingForm.findById(this.form.id);
            this.state = form.state;

            this.form.state = form.state;
            this.form.title = form.title;
            this.form.beginAt = form.beginAt;
            this.form.endAt = form.endAt;
            this.form.roomId = form.room;
            this.room = await resourceService.findRoomById(this.form.roomId);
        } else {
            this.state = 'init';
            let room = await resourceService.findRoomByCode(this.form.roomCode);
            if (!room) throw new ServerError(403, '会议室不存在');
            this.room = room;
            this.form.roomId = room.id;
        }
    }

    async _checkCalendar() {
        let calendar = await calendarService.findOrCreateByResoucesId(this.room.id);
        let hitTest = await calendarService.hitTest({
            calendarId: calendar._id,
            beginAt: this.form.beginAt,
            endAt: this.form.endAt
        });
        if (hitTest) throw new ServerError(403, '时间冲突');
    }

    async create() {
        await this._fetchForm();

        // check calendar
        await this._checkCalendar();

        if (this.room.needAudit) {
            return await this.execute('audit');
        } else {
            return await this.execute('create');
        }
    }

    async agree() {
        await this._fetchForm();

        // check calendar
        await this._checkCalendar();

        return await this.execute('pass');
    }

    async reject() {
        await this._fetchForm();

        return await this.execute('refuse');
    }

    async _onAudit() {
        // save form
        let form = await CreateMeetingForm.create({
            title: this.form.title,
            beginAt: this.form.beginAt,
            endAt: this.form.endAt,
            room: this.form.roomId,
            state: 'audit',
            createdBy: 'cwj',
        });
        this.form.code = form.code;

        // notify
        await notifyService.notify('待审核');
        return form;
    }

    async _onSuccess() {
        // save form
        let form = await CreateMeetingForm.create({
            title: this.form.title,
            beginAt: this.form.beginAt,
            endAt: this.form.endAt,
            room: this.form.roomId,
            state: 'success',
            createdBy: 'cwj',
        });
        this.form.code = form.code;

        // create meeting
        let meeting = await Meeting.create({
            title: this.form.title,
            beginAt: this.form.beginAt,
            endAt: this.form.endAt,
            room: this.form.roomId,
            createdBy: 'cwj',
            formCode: this.form.code,
        });

        let calendar = await calendarService.findOrCreateByResoucesId(this.room.id);
        calendar.events.push(meeting);
        await calendar.save();

        // notify
        await notifyService.notify('预订成功');
        return meeting;
    }

    async _onPass() {
        // save form
        let form = await CreateMeetingForm.findById(this.form.id);
        form.auditData = {
            result: true,
            comment: this.form.comment,
            auditedBy: 'nonocast',
            auditedAt: moment().unix(),
        };
        form.state = 'success';
        await form.save();

        // create meeting
        let meeting = await Meeting.create({
            title: this.form.title,
            beginAt: this.form.beginAt,
            endAt: this.form.endAt,
            room: this.form.roomId,
            createdBy: 'cwj',
            formCode: this.form.code,
        });

        let calendar = await calendarService.findOrCreateByResoucesId(this.room.id);
        calendar.events.push(meeting);
        await calendar.save();

        // notify
        await notifyService.notify('审核通过');
        return meeting;
    }

    async _onRefused() {
        // save form
        let form = await CreateMeetingForm.findById(this.form.id);
        form.auditData = {
            result: false,
            comment: this.form.comment,
            auditedBy: 'nonocast',
            auditedAt: moment().unix(),
        };
        form.state = 'refused';
        await form.save();

        // notify
        await notifyService.notify('审核不通过');
        return form;
    }
}

module.exports = CreateMeetingWorkflow;
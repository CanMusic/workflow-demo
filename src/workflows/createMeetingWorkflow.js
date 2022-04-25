const _ = require('lodash');
const moment = require('moment');
let meetingService = require('../services/MeetingService');
let calendarService = require('../services/CalendarService');
let notifyService = require('../services/NotifyService');
const BaseWorkflow = require('./baseWorkflow');
const ServerError = require('../misc/ServerError');

// states: [init, audit, success, refused]
// init -> success
// init -> audit
// audit -> success
// audit -> refused
class CreateMeetingWorkflow extends BaseWorkflow {
    constructor(state = 'init') {
        super(state);
        this.fsm = [
            { action: 'requestAudit', from: 'init', to: 'audit', fire: this._onAudit },
            { action: 'pass', from: 'init', to: 'success', fire: this._onSuccess },
            { action: 'pass', from: 'audit', to: 'success', fire: this._onSuccess },
            { action: 'refuse', from: 'audit', to: 'refused', fire: this._onRefused },
        ];
    }

    async _onAudit(form) {
        let calendar = await calendarService.findOrCreateByResoucesId(form.room);
        let hitTest = await calendarService.hitTest({
            calendarId: calendar._id,
            beginAt: form.beginAt,
            endAt: form.endAt
        });
        if (hitTest) throw new ServerError(403, '时间冲突');

        let result = await meetingService.audit(form);
        form.ctx.eventId = result._id;
        await form.save();

        calendar.events.push(result);
        await calendar.save();

        await notifyService.notify('待审核');
        return result;
    }

    async _onSuccess(form) {
        let result = await meetingService.success(form);
        await form.save();

        await notifyService.notify('预订成功');
        return result;
    }

    async _onRefused(form) {
        let result = await meetingService.refuse(form);
        await form.save();

        await notifyService.notify('审核不通过');
        return result;
    }
}

module.exports = CreateMeetingWorkflow;
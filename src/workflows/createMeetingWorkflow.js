const _ = require('lodash');
const moment = require('moment');
let meetingService = require('../services/meetingService.js');
let notifyService = require('../services/notifyService.js');
const BaseWorkflow = require('./baseWorkflow.js');

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
        let result = await meetingService.audit(form);
        await notifyService.notify('待审核');
        return result;
    }

    async _onSuccess(form) {
        let result = await meetingService.success(form);
        await notifyService.notify('预订成功');
        return result;
    }

    async _onRefused(form) {
        let result = await meetingService.refuse(form);
        await notifyService.notify('审核不通过');
        return result;
    }
}

module.exports = CreateMeetingWorkflow;
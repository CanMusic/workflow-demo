const _ = require('lodash');
const moment = require('moment');
let meetingService = require('../services/meetingService.js');
let notifyService = require('../services/notifyService.js');

// states: [init, audit, success, refused]
// init -> success
// init -> audit
// audit -> success
// audit -> refused
class CreateMeetingWorkflow {
    constructor(state = 'init') {
        this.state = state;
        this.fsm = [
            { action: 'requestAudit', from: 'init', to: 'audit', fire: this._onAudit },
            { action: 'pass', from: 'init', to: 'success', fire: this._onSuccess },
            { action: 'pass', from: 'audit', to: 'success', fire: this._onSuccess },
            { action: 'refuse', from: 'audit', to: 'refused', fire: this._onRefused },
        ];
    }

    async transition(form) {
        console.log(this.state);
        if (!form) throw new Error('Form is required.');
        let action = this._extract(form);
        let item = _.find(this.fsm, p => {
            return p.action == action && p.from == this.state;
        });
        if (!item) throw new Error('Invalid transition.');

        this.state = item.to;
        return await item.fire(form);
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

    _extract(form) {
        if (form.needAudit == false || form.auditResult == true) return 'pass';
        if (form.needAudit == true && form.auditResult == null) return 'requestAudit';
        if (form.needAudit == true && form.auditResult == false) return 'refuse';
        throw new Error('Unknown form data.');
    }
}

module.exports = CreateMeetingWorkflow;
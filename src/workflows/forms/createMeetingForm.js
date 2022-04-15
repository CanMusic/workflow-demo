const _ = require('lodash');
const moment = require('moment');
const { nanoid } = require('nanoid');

class CreateMeetingForm {
    constructor() {
        this.ctx = {};
        this.code = nanoid();
        this.title = '无主题会议';
        this.beginAt = moment().unix();
        this.endAt = moment().add(1, 'h').unix();
        this.room = null;
        this.createdBy = null;
        this.createdAt = moment().unix();
        this.needAudit = false;
        this.auditResult = null;
        this.auditComment = null;
        this.auditBy = null;
    }
}

module.exports = CreateMeetingForm;
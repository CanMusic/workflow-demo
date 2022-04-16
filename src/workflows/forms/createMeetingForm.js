const _ = require('lodash');
const moment = require('moment');
const { nanoid } = require('nanoid');
const BaseForm = require('./baseForm');
const Form = require('../../models/Form');

class CreateMeetingForm extends BaseForm {
    constructor() {
        super();
        this.type = 'createMeeting';
        this.title = '无主题会议';
        this.beginAt = moment().unix();
        this.endAt = moment().add(1, 'h').unix();
        this.room = null;
        this.needAudit = false;
        this.auditResult = null;
        this.auditComment = null;
        this.auditBy = null;
    }

    extractAction() {
        if (this.needAudit == false || this.auditResult == true) return 'pass';
        if (this.needAudit == true && this.auditResult == null) return 'requestAudit';
        if (this.needAudit == true && this.auditResult == false) return 'refuse';
        throw new Error('Unknown form data.');
    }

    async load(code) {
        let form = await Form.findOne({ code });
        if (!form || form.type != 'createMeeting') throw new Error('CreateMeetingForm is required.');

        let data = JSON.parse(form.content);

        this.type = form.type;
        this.code = form.code;
        this.ctx = form.ctx;
        this.createdBy = form.createdBy;
        this.createdAt = form.createdAt;
        this.title = data.title;
        this.beginAt = data.beginAt;
        this.endAt = data.endAt;
        this.room = data.room;
        this.needAudit = data.needAudit;
        this.auditResult = data.auditResult;
        this.auditComment = data.auditComment;
        this.auditBy = data.auditBy;
        return this;
    }
}

module.exports = CreateMeetingForm;
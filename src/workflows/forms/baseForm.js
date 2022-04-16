const _ = require('lodash');
const moment = require('moment');
const { nanoid } = require('nanoid');
const Form = require('../../models/Form');

class BaseForm {
    constructor() {
        this.ctx = {};
        this.type = null;
        this.code = nanoid();
        this.createdBy = null;
        this.createdAt = moment().unix();
        this.content = {};
    }

    extractAction() { new Error('Not implement.'); }

    async save() {
        let form = await Form.findOne({ code: this.code });
        if (!form) {
            return await Form.create({
                ctx: this.ctx,
                type: this.type,
                code: this.code,
                createdBy: this.createdBy,
                createdAt: this.createdAt,
                content: JSON.stringify(this),
            });
        }

        form.content = JSON.stringify(this);
        form.ctx = this.ctx;
        return await form.save();
    }

    async load() { new Error('Not implement.'); }
}

module.exports = BaseForm;

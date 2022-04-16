const _ = require('lodash');
const moment = require('moment');
const BaseForm = require('./forms/baseForm');

class BaseWorkflow {
    constructor(state) {
        this.state = state;
        this.fsm = [];
    }

    async transition(form) {
        if (!form) throw new Error('Form is required.');
        if (!(form instanceof BaseForm)) throw new Error('Form is not BaseForm.');
        let action = form.extractAction();
        let item = _.find(this.fsm, p => {
            return p.action == action && p.from == this.state;
        });
        if (!item) throw new Error('Invalid transition.');

        this.state = item.to;
        return await item.fire(form);
    }

}

module.exports = BaseWorkflow;
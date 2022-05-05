const _ = require('lodash');
const moment = require('moment');

class Workflow {
    constructor() {
        this.state = null;
        this.fsm = [];
    }

    async execute(action) {
        let item = _.find(this.fsm, p => {
            return p.action == action && p.from == this.state;
        });
        if (!item) throw new Error('Invalid action.');

        let result = await item.fire.call(this);
        this.state = item.to;
        return result;
    }
}

module.exports = Workflow;
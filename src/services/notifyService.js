const _ = require('lodash');
const moment = require('moment');

class NotifyService {
    constructor() {
    }

    async notify(message) {
        console.log('notify: ' + message);
    }
}

module.exports = new NotifyService();
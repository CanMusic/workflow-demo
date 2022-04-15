const { mongoose } = require('../middleware/mongodb.js');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CalendarSchema = new Schema({
    name: { type: String, required: true, index: true },
    events: [{ type: ObjectId, ref: 'Event', required: true }],
    timezone: { type: String, required: true, default: 'Asia/Shanghai' }
});

module.exports = mongoose.model('Calendar', CalendarSchema, 'calendars');

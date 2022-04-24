const { mongoose } = require('../middleware/mongodb.js');
const { nanoid } = require('nanoid');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

var options = { discriminatorKey: 'type' };

const Event = mongoose.model('Event', new Schema({
    code: { type: String, required: true, index: true, default() { return nanoid(); }, unique: true },
    beginAt: { type: Number, required: true },
    endAt: { type: Number, required: true },
    rrule: { type: String },
    createdBy: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    ctx: {
        formCode: { type: String },
    },
}, options), 'events');

const Meeting = Event.discriminator('Meeting', new Schema({
    title: { type: String, required: true },
    room: { type: ObjectId, ref: 'Room' },
    state: { type: String },
}, options));

const DeskBooking = Event.discriminator('DeskBooking', new Schema({
    desk: { type: ObjectId, ref: 'Desk' },
    state: { type: String },
}, options));

const Visit = Event.discriminator('Visit', new Schema({
    interviewee: { type: ObjectId, ref: 'User' },
    visitor: { type: String, required: true },
}, options));

exports.Event = Event;
exports.Meeting = Meeting;
exports.DeskBooking = DeskBooking;
exports.Visit = Visit;

const { mongoose } = require('../middleware/mongodb.js');
const { nanoid } = require('nanoid');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

var options = { discriminatorKey: 'type' };

const Resource = mongoose.model('Resource', new Schema({
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, index: true, default: nanoid() },
    calendar: { type: ObjectId, ref: 'Calendar' },
    enabled: { type: Boolean, required: true, default: true },
    description: { type: String },
}, options), 'resources');

const User = Resource.discriminator('User', new Schema({
    email: { type: String },
    mobile: { type: String },
    avatar: { type: String },
}, options));

const Room = Resource.discriminator('Room', new Schema({
    building: { type: String },
    floor: { type: String },
    capacity: { type: Number },
    deviceTag: { type: String },
    bookable: { type: Boolean, required: true, default: true },
}, options));

const Desk = Resource.discriminator('Desk', new Schema({
    building: { type: String },
    floor: { type: String },
    bookable: { type: Boolean, required: true, default: true },
    diagram: { type: String },
    x: { type: Number },
    y: { type: Number }
}, options));

exports.Resource = Resource;
exports.User = User;
exports.Room = Room;
exports.Desk = Desk;

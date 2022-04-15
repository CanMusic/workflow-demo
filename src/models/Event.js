const { mongoose } = require('../middleware/mongodb.js');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const EventSchema = new Schema({
    title: { type: String, required: true, index: true },
    beginAt: { type: Number, required: true },
    endAt: { type: Number, required: true },
    rrule: { type: String },
    resource: { type: ObjectId, ref: 'Resource' },
    createdBy: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    state: { type: String },
    ctx: {
        formCode: { type: String },
    }
});

module.exports = mongoose.model('Event', EventSchema, 'events');

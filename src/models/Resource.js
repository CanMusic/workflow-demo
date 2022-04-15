const { mongoose } = require('../middleware/mongodb.js');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ResourceSchema = new Schema({
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, index: true },
    type: { type: String, enum: ['user', 'room', 'desk'], required: true },
    calendar: { type: ObjectId, required: true, ref: 'Calendar' },
});

module.exports = mongoose.model('Resource', ResourceSchema, 'resources');

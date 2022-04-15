const { mongoose } = require('../middleware/mongodb.js');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const FormSchema = new Schema({
    code: { type: String, require: true },
    type: { type: String, enum: ['createMeeting', 'modifyMeeting', 'cancelMeeting'], required: true },
    content: { type: String },
    ctx: {
        eventId: { type: String },
    }
});

module.exports = mongoose.model('Form', FormSchema, 'forms');

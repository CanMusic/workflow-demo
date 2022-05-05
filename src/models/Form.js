const { nanoid } = require('nanoid');
const { mongoose } = require('../middleware/mongodb.js');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

var options = { discriminatorKey: 'type' };

const Form = mongoose.model('Form', new Schema({
    code: { type: String, require: true, default() { return nanoid(); }, unique: true },
    createdBy: { type: String, required: true },
    isOpen: { type: Boolean, required: true, default: true },
}, options), 'forms');

const CreateMeetingForm = Form.discriminator('CreateMeeting', new Schema({
    title: { type: String, require: true },
    beginAt: { type: Number, require: true },
    endAt: { type: Number, require: true },
    room: { type: ObjectId, ref: 'Room', require: true },
    state: { type: String, required: true },
    auditData: {
        result: { type: Boolean },
        comment: { type: String },
        auditedBy: { type: String },
        auditedAt: { type: Number },
    },
    eventId: { type: String },
}, options));

CreateMeetingForm.prototype.extractAction = (form) => {
    if (form.needAudit == false || form.auditResult == true) return 'pass';
    if (form.needAudit == true && form.auditResult == null) return 'requestAudit';
    if (form.needAudit == true && form.auditResult == false) return 'refuse';
    throw new Error('Unknown form data.');
};

exports.Form = Form;
exports.CreateMeetingForm = CreateMeetingForm;

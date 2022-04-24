const { nanoid } = require('nanoid');
const { mongoose } = require('../middleware/mongodb.js');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

var options = { discriminatorKey: 'type' };

const Form = mongoose.model('Form', new Schema({
    code: { type: String, require: true, default: nanoid() },
    createdBy: { type: String, required: true },
    ctx: {
        eventId: { type: String },
    }
}, options), 'forms');

const CreateMeetingForm = Form.discriminator('CreateMeeting', new Schema({
    title: { type: String, require: true },
    beginAt: { type: Number, require: true },
    endAt: { type: Number, require: true },
    room: { type: String, require: true },
    needAudit: { type: Boolean, require: true },
    auditResult: { type: Boolean },
    auditComment: { type: String },
    auditBy: { type: String },
    auditAt: { type: Number },
}, options));

CreateMeetingForm.prototype.extractAction = (form) => {
    if (form.needAudit == false || form.auditResult == true) return 'pass';
    if (form.needAudit == true && form.auditResult == null) return 'requestAudit';
    if (form.needAudit == true && form.auditResult == false) return 'refuse';
    throw new Error('Unknown form data.');
};

exports.Form = Form;
exports.CreateMeetingForm = CreateMeetingForm;

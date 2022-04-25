const moment = require('moment');
const Router = require('koa-router');

let CreateMeetingWorkflow = require('../workflows/createMeetingWorkflow.js');

let meetingService = require('../services/MeetingService.js');
let formService = require('../services/FormService.js');

const router = new Router({ prefix: '/meetings' });

router.get('/', async (ctx) => {
	ctx.body = await meetingService.findAllMeetings();
	ctx.status = 200;
});

router.get('/:id', async (ctx) => {
	let id = ctx.params.id;
	ctx.body = await meetingService.findMeetingById(id);
	ctx.status = 200;
});

router.post('/', async (ctx) => {
	let body = ctx.request.body;

	let form = await formService.saveCreateMeetingForm(body);
	let workflow = new CreateMeetingWorkflow();
	let meeting = await workflow.transition(form);

	ctx.body = meeting;
	ctx.status = 201;
});

router.patch('/:id', async (ctx) => {
	let id = ctx.params.id;
	ctx.body = `patch meeting(${id})`;
	ctx.status = 201;
});

router.delete('/:id', async (ctx) => {
	let id = ctx.params.id;
	ctx.status = 204;
});

router.post('/:id/agree', async (ctx) => {
	let id = ctx.params.id;
	let { comment } = ctx.request.body;

	let meeting = await meetingService.findMeetingById(id);
	let form = await formService.findCreateMeetingFormByCode(meeting.ctx.formCode);
	form.auditResult = true;
	form.auditComment = comment;
	form.auditBy = 'nonocast';
	form.auditAt = moment().unix();

	let workflow = new CreateMeetingWorkflow(meeting.state);
	meeting = await workflow.transition(form);

	ctx.body = meeting;
	ctx.status = 201;
});

router.post('/:id/reject', async (ctx) => {
	let id = ctx.params.id;
	let { comment } = ctx.request.body;

	let meeting = await meetingService.findMeetingById(id);
	let form = await formService.findCreateMeetingFormByCode(meeting.ctx.formCode);
	form.auditResult = false;
	form.auditComment = comment;
	form.auditBy = 'nonocast';
	form.auditAt = moment().unix();

	let workflow = new CreateMeetingWorkflow(meeting.state);
	meeting = await workflow.transition(form);

	ctx.body = meeting;
	ctx.status = 201;
});

module.exports = router;

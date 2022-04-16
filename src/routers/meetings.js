const Router = require('koa-router');

let CreateMeetingWorkflow = require('../workflows/createMeetingWorkflow.js');
let CreateMeetingForm = require('../workflows/forms/createMeetingForm.js');

let meetingService = require('../services/meetingService.js');

const router = new Router({ prefix: '/meetings' });

router.get('/', async (ctx) => {
	ctx.body = 'find all meetings';
	ctx.status = 200;
});

router.get('/:id', async (ctx) => {
	let id = ctx.params.id;
	ctx.body = `find meeting(${id})`;
	ctx.status = 200;
});

router.post('/', async (ctx) => {
	let body = ctx.request.body;
	let form = new CreateMeetingForm();
	form.title = body.title;
	form.beginAt = body.beginAt;
	form.endAt = body.endAt;
	form.room = 'A101';
	form.createdBy = 'cwj';
	form.needAudit = true;

	let workflow = new CreateMeetingWorkflow();
	let event = await workflow.transition(form);

	ctx.body = event;
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

	let event = await meetingService.findEventById(id);

	let form = await new CreateMeetingForm().load(event.ctx.formCode);
	form.auditResult = true;
	form.auditComment = comment;

	let workflow = new CreateMeetingWorkflow(event.state);
	event = await workflow.transition(form);

	ctx.body = event;
	ctx.status = 201;
});

router.post('/:id/reject', async (ctx) => {
	let id = ctx.params.id;
	let { comment } = ctx.request.body;

	let event = await meetingService.findEventById(id);

	let form = await new CreateMeetingForm().load(event.ctx.formCode);
	form.auditResult = false;
	form.auditComment = comment;

	let workflow = new CreateMeetingWorkflow(event.state);
	event = await workflow.transition(form);

	ctx.body = event;
	ctx.status = 201;
});

module.exports = router;

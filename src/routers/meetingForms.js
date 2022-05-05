const Router = require('koa-router');

let MeetingFormService = require('../services/MeetingFormService');
let CreateMeetingWorkflow = require('../workflows/CreateMeetingWorkflow.js');

const router = new Router({ prefix: '/meetingforms' });

router.get('/', async (ctx) => {
	ctx.body = await MeetingFormService.findAll();
	ctx.status = 200;
});

router.get('/:id', async (ctx) => {
	let id = ctx.params.id;
	ctx.body = await MeetingFormService.findById(id);
	ctx.status = 200;
});

router.post('/', async (ctx) => {
	let { title, roomCode, beginAt, endAt } = ctx.request.body;
	let formData = {
		title,
		roomCode,
		beginAt,
		endAt,
	};

	let workflow = new CreateMeetingWorkflow(formData);
	let result = await workflow.create();

	ctx.body = result;
	ctx.status = 200;
});

router.post('/:id/agree', async (ctx) => {
	let id = ctx.params.id;
	let { comment } = ctx.request.body;
	let formData = {
		id,
		comment,
	};

	let workflow = new CreateMeetingWorkflow(formData);
	result = await workflow.agree();

	ctx.body = result;
	ctx.status = 200;
});

router.post('/:id/reject', async (ctx) => {
	let id = ctx.params.id;
	let { comment } = ctx.request.body;
	let formData = {
		id,
		comment,
	};

	let workflow = new CreateMeetingWorkflow(formData);
	result = await workflow.reject();

	ctx.body = result;
	ctx.status = 200;
});

module.exports = router;

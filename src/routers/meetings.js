const moment = require('moment');
const Router = require('koa-router');

let meetingService = require('../services/MeetingService.js');

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

module.exports = router;

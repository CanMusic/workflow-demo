const Router = require('koa-router');
const axios = require('axios');
const moment = require('moment');
const handlebars = require('handlebars');
const backend_origin = 'http://localhost:9001';
const http = axios.create({ baseURL: backend_origin });

handlebars.registerHelper('formatDate', (timestamp) => {
	return moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
});

handlebars.registerHelper('needAudit', (state) => {
	return state == 'audit';
});

handlebars.registerHelper('hasAudit', (auditData) => {
	return auditData != null;
});

handlebars.registerHelper('isCreateMeetingForm', (form) => {
	console.dir(form);
	return form.type == 'CreateMeeting';
});

const router = new Router({ prefix: '/views' });

router.get('/', async (ctx) => {
	await ctx.render('debug', { backend_origin });
});

router.get('/meetings', async (ctx) => {
	let res = await http.get('/meetings');
	let meetings = res.data;
	await ctx.render('meetings', { backend_origin, meetings });
});

router.get('/meetings/:id', async (ctx) => {
	let id = ctx.request.params.id;
	let res = await http.get(`/meetings/${id}`);
	let meeting = res.data;
	await ctx.render('meeting', { backend_origin, meeting });
});


router.get('/meetingforms', async (ctx) => {
	let res = await http.get('/meetingforms');
	let forms = res.data;
	await ctx.render('forms', { backend_origin, forms });
});

router.get('/meetingforms/create', async (ctx) => {
	let res = await http.get('/resources/room');
	let rooms = res.data;
	await ctx.render('create', { backend_origin, rooms });
});

router.get('/meetingforms/:id', async (ctx) => {
	let id = ctx.request.params.id;
	let res = await http.get(`/meetingforms/${id}`);
	let form = res.data;
	await ctx.render('form', { backend_origin, form });
});

router.post('/meetingforms', async (ctx) => {
	let body = ctx.request.body;
	body.beginAt = moment(body.beginAt).unix();
	body.endAt = moment(body.endAt).unix();
	let res = await http.post('/meetingforms', body);
	if (res.data.result == false) {
		ctx.status = res.data.errorCode;
		ctx.body = res.data.message;
		return;
	}
	ctx.status = 200;
});

router.get('/meetingforms/:id/audit', async (ctx) => {
	let id = ctx.request.params.id;
	let res = await http.get(`/meetingforms/${id}`);
	let meeting = res.data;
	await ctx.render('audit', { backend_origin, meeting });
});

router.post('/meetingforms/:id/audit', async (ctx) => {
	let id = ctx.request.params.id;
	let body = ctx.request.body;
	if (body.result == 'true') {
		let res = await http.post(`/meetingforms/${id}/agree`, body);
		if (res.data.result == false) {
			ctx.status = res.data.errorCode;
			ctx.body = res.data.message;
			return;
		}
	}
	else {
		await http.post(`/meetingforms/${id}/reject`, body);
	}
	ctx.redirect('/views/meetingforms');
});

module.exports = router;

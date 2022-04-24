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

const router = new Router({ prefix: '/views' });

router.get('/', async (ctx) => {
	await ctx.render('debug', { backend_origin });
});

router.get('/meetings', async (ctx) => {
	let res = await http.get('/meetings');
	let meetings = res.data;
	await ctx.render('meetings', { backend_origin, meetings });
});

router.post('/meetings', async (ctx) => {
	let body = ctx.request.body;
	body.beginAt = moment(body.beginAt).unix();
	body.endAt = moment(body.endAt).unix();
	await http.post('/meetings', body);
	ctx.redirect('/views/meetings');
});

router.get('/meetings/create', async (ctx) => {
	let res = await http.get('/resources/room');
	let rooms = res.data;
	await ctx.render('create', { backend_origin, rooms });
});

router.get('/meetings/:id', async (ctx) => {
	let id = ctx.request.params.id;
	let res = await http.get(`/meetings/${id}`);
	let meeting = res.data;
	await ctx.render('meeting', { backend_origin, meeting });
});

router.get('/meetings/:id/audit', async (ctx) => {
	let id = ctx.request.params.id;
	let res = await http.get(`/meetings/${id}`);
	let meeting = res.data;
	await ctx.render('audit', { backend_origin, meeting });
});

router.post('/meetings/:id/audit', async (ctx) => {
	let id = ctx.request.params.id;
	let body = ctx.request.body;
	if (body.result == 'true') await http.post(`/meetings/${id}/agree`, body);
	else await http.post(`/meetings/${id}/reject`, body);
	ctx.redirect('/views/meetings');
});

router.get('/forms', async (ctx) => {
	let res = await http.get('/forms');
	let forms = res.data;
	await ctx.render('forms', { backend_origin, forms });
});

router.get('/forms/:id', async (ctx) => {
	let id = ctx.request.params.id;
	let res = await http.get(`/forms/${id}`);
	let form = res.data;
	await ctx.render('form', { backend_origin, form });
});

module.exports = router;

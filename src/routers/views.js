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

router.get('/meetings', async (ctx) => {
	let res = await http.get('/meetings');
	let resBody = res.data;
	await ctx.render('list', { backend_origin, meetings: resBody });
});

router.get('/meetings/create', async (ctx) => {
	await ctx.render('create', { backend_origin });
});

router.get('/meetings/:id', async (ctx) => {
	let id = ctx.request.params.id;
	let res = await http.get(`/meetings/${id}`);
	let resBody = res.data;
	await ctx.render('meeting', { backend_origin, meeting: resBody });
});

router.post('/meetings', async (ctx) => {
	let body = ctx.request.body;
	body.beginAt = moment(body.beginAt).unix();
	body.endAt = moment(body.endAt).unix();
	await http.post('/meetings', body);
	ctx.redirect('/views/meetings');
});

module.exports = router;

const Router = require('koa-router');
let formService = require('../services/formService');

const router = new Router({ prefix: '/forms' });

router.get('/', async (ctx) => {
	ctx.body = await formService.findAll();
	ctx.status = 200;
});

router.get('/:id', async (ctx) => {
	let id = ctx.params.id;
	ctx.body = await formService.findById(id);
	ctx.status = 200;
});

module.exports = router;

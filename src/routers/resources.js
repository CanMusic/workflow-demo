const Router = require('koa-router');
let resourceService = require('../services/ResourceService');

const router = new Router({ prefix: '/resources' });

router.get('/room', async (ctx) => {
	ctx.body = await resourceService.findAllRooms();
	ctx.status = 200;
});

router.get('/user', async (ctx) => {
	ctx.body =  await resourceService.findAllUsers();
	ctx.status = 200;
});

router.get('/desk', async (ctx) => {
	ctx.body =  await resourceService.findAllDesks();
	ctx.status = 200;
});

module.exports = router;

const Router = require('koa-router');

const router = new Router({ prefix: '/' });

router.get('/', async (ctx) => {
	ctx.body = 'It works!';
	ctx.status = 200;
});

module.exports = router;

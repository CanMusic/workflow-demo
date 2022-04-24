const config = require('config');
const path = require('path');
const Koa = require('koa');
const _ = require('lodash');
const moment = require('moment');
const cors = require('@koa/cors');
const koaJson = require('koa-json');
const koaBodyParser = require('koa-bodyparser');
const koaViews = require('koa-views');
const koaStatic = require('koa-static');
const koaMount = require('koa-mount');
const basic = require('./routers/basic.js');
const views = require('./routers/views.js');
const meetings = require('./routers/meetings.js');
const resources = require('./routers/resources.js');
const forms = require('./routers/forms.js');

class WebServer {
    constructor() {
        let koa = new Koa();
        koa.proxy = true;
        koa.use(cors());
        koa.use(
            koaViews(path.join(__dirname, 'views'), {
                extension: 'hbs',
                map: { hbs: 'handlebars' },
            })
        );
        koa.use(koaMount('/', koaStatic(path.join(__dirname, 'public'))));
        koa.use(koaJson());
        koa.use(koaBodyParser());
        koa.use(basic.routes());
        koa.use(views.routes());
        koa.use(meetings.routes());
        koa.use(resources.routes());
        koa.use(forms.routes());

        koa.on('error', (error, ctx) => {
            console.log('koa encounter error :', error);
        });

        this.koa = koa;
        this.server = null;
    }

    async open() {
        return new Promise((resolve, reject) => {
            this.server = this.koa.listen(config.port, '0.0.0.0', () => {
                console.log(`Web server started, please visit: http://localhost:${config.port} (with ${process.env.NODE_ENV} mode)`);
                resolve();
            });
        });
    }

    async close() {
        if (!this.server) return;
        await this.server.close();
        console.log('Web server closed.');
    }
}

module.exports = new WebServer();

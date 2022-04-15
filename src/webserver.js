const config = require('config');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaJson = require('koa-json');
const koaBodyParser = require('koa-bodyparser');
const basic = require('./routers/basic.js');
const meetings = require('./routers/meetings.js');

class WebServer {
    constructor() {
        let koa = new Koa();
        koa.proxy = true;
        koa.use(cors());
        koa.use(koaJson());
        koa.use(koaBodyParser());
        koa.use(basic.routes());
        koa.use(meetings.routes());

        koa.on('error', (error, ctx) => {
            console.log('koa encounter error :', error);
        });

        this.koa = koa;
        this.server = null;
    }

    async open() {
        return new Promise((resolve, reject) => {
            this.server = this.koa.listen(config.port, '0.0.0.0', () => {
                console.log(`Web server started, please visit: http://:${config.port} (with ${process.env.NODE_ENV} mode)`);
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

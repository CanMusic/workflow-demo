if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

const app = require('./App');

const main = async () => {
    await app.open();
};

const cleanup = async signal => {
    console.log(`============= cleanup ${signal}`);
    await app.close();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

process.on('uncaughtException', (err, origin) => {
    console.dir({ err, origin });
});

process.on('unhandledRejection', (reason, promise) => {
    console.dir({ reason });
    console.log('============= unhandledRejection Fatal', promise, 'reason:', reason);
});

process.on('beforeExit', code => {
    console.log('============= Process beforeExit event with code: ', code);
});

process.on('exit', code => {
    console.log(`============= About to exit with code: ${code}`);
});

main().catch(error => {
    console.dir({ error });
});
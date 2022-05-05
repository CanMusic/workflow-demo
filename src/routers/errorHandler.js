let handler = async (ctx, next) => {
  return next().catch(err => {
    const { statusCode, message } = err;

    ctx.type = 'json';
    ctx.status = 200;
    ctx.body = {
      result: false,
      errorCode: statusCode,
      message
    };

    ctx.app.emit('error', err, ctx);
  });
};

module.exports = handler;
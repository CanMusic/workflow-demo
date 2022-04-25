let handler = async (ctx, next) => {
  return next().catch(err => {
    const { statusCode, message } = err;

    ctx.type = 'json';
    ctx.status = statusCode || 500;
    ctx.body = {
      result: false,
      message
    };

    ctx.app.emit('error', err, ctx);
  });
};

module.exports = handler;
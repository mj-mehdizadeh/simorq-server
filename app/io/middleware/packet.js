'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const params = { ok: true };
    try {
      params.response = await next();
    } catch (e) {
      params.ok = false;
      params.code = e.code;
      params.params = e.errors || e.params || e.data;
    }
    ctx.socket.emit('res', ctx.args[0], params);
  };
};

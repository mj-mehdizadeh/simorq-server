'use strict';

module.exports = () => {
  return async function(ctx, next) {
    try {
      ctx.body = await next();
    } catch (e) {
      ctx.throwError(e.code, e.errors || e.params || e.data);
    }
  };
};


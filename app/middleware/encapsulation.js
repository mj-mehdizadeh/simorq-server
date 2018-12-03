'use strict';

module.exports = () => {
  return async function(ctx, next) {
    try {
      const response = await next();
      if (response) {
        ctx.body = response;
      }
    } catch (e) {
      ctx.throwError(e.code || e.error, e.errors || e.params || e.data || e.error_description, e.status);
    }
  };
};


'use strict';

module.exports = () => {
  return async function(ctx, next) {
    try {
      const response = await next();
      if (response) {
        ctx.body = response;
      }
    } catch (e) {
      console.log('Error', e);
      ctx.throwError(e.code || e.name || e.error, e.errors || e.params || e.data || e.error_description, e.status);
    }
  };
};


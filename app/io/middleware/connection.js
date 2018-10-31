'use strict';

module.exports = () => {
  return async (ctx, next) => {
    console.log('socket connection!');
    await next(); // execute when disconnect.
  };
};

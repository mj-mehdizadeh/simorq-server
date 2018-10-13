module.exports = app => {
  return async (ctx, next) => {
    console.log('socket connection!');
    await next(); // execute when disconnect.
  };
};
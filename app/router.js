'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.post('/auth/sendCode', controller.auth.sendCode.run);
  router.post('/auth/login', controller.auth.login.run);
  io.route('/', io.controller.default.index);
};

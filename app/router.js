'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/auth/sendCode', controller.auth.sendCode.run);
  router.post('/auth/login', controller.auth.login.run);
  router.post('/auth/register', controller.auth.register.run);
};

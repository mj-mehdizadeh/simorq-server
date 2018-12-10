'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  app.all('/auth/token', app.oAuth2Server.token());
  router.post('/auth/sendCode', controller.auth.sendCode.run);
  router.post('/auth/login', controller.auth.login.run);
  router.post('/auth/register', controller.auth.register.run);
  router.post('/rooms', app.oAuth2Server.authenticate(), controller.rooms.create.run);
  router.patch('/rooms/:id', app.oAuth2Server.authenticate(), controller.rooms.edit.run);
};

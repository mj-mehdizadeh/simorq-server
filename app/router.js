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
  router.post('/rooms/:id/avatar', app.oAuth2Server.authenticate(), controller.rooms.avatar.create.run);
  router.get('/rooms', app.oAuth2Server.authenticate(), controller.rooms.get.run);

  router.post('/subscribes', app.oAuth2Server.authenticate(), controller.subscribes.create.run);
  router.get('/subscribes', app.oAuth2Server.authenticate(), controller.subscribes.get.run);

  router.post('/upload', app.oAuth2Server.authenticate(), controller.files.upload.run);
  router.get('/download/:token/:name', controller.files.download.run);

  router.post('/messages', app.oAuth2Server.authenticate(), controller.messages.create.run);
  router.patch('/messages', app.oAuth2Server.authenticate(), controller.messages.edit.run);
  router.get('/messages/:roomId', app.oAuth2Server.authenticate(), controller.messages.get.run);

  router.post('/contacts', app.oAuth2Server.authenticate(), controller.contacts.import.run);
  router.post('/contacts/check', app.oAuth2Server.authenticate(), controller.contacts.checkHash.run);
  router.get('/contacts', app.oAuth2Server.authenticate(), controller.contacts.get.run);

  router.get('/client/me', app.oAuth2Server.authenticate(), controller.client.me.run);
  router.get('/client/wallpaper', app.oAuth2Server.authenticate(), controller.client.wallpaper.run);
};

'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/messages/edit.test.js', () => {

  it('test PATCH /messages', async () => {
    return await app.httpRequest()
      .patch('/messages')
      .type('json')
      .set('Authorization', 'Bearer ' + global.access_token)
      .send({
        message_id: global.message_id,
        text: 'hi Edited',
      })
      .expect(200);
  });
});

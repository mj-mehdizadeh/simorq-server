'use strict';

const { app } = require('egg-mock/bootstrap');
const random = require('lodash').random;

describe('test/app/controller/messages/create.test.js', () => {

  it('test POST /messages', () => {
    return app.httpRequest()
      .post('/messages')
      .type('json')
      .set('Authorization', 'Bearer ' + global.access_token)
      .send({
        room_id: '5c0eb46a3b536312fcb9d9f0',
        random_id: random(10000),
      })
      .expect(400)
      .expect({
        name: 'content_required',
        params: null,
      });
  });
  it('test unauthorized group POST /messages', () => {
    return app.httpRequest()
      .post('/messages')
      .type('json')
      .set('Authorization', 'Bearer ' + global.access_token)
      .send({
        room_id: '5c0eb8c23105ea289caf5526',
        random_id: random(10000),
        text: 'hi',
      })
      .expect(400)
      .expect({
        name: 'invalid_room_access',
      });
  });
  it('test unauthorized group POST /messages', () => {
    return app.httpRequest()
      .post('/messages')
      .type('json')
      .set('Authorization', 'Bearer ' + global.access_token)
      .send({
        room_id: '5c24d8e0b431df2fc038571e',
        random_id: random(10000),
        text: 'hi',
      })
      .expect(200);
  });

});

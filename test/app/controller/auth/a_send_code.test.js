'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/auth/send_code.test.js', () => {

  it('should GET /auth/sendCode', () => {
    return app.httpRequest()
      .get('/auth/sendCode')
      .expect(404);
  });

  it('should POST /auth/sendCode', async () => {
    global.phone_number = 98910;
    const response = await app.httpRequest()
      .post('/auth/sendCode')
      .type('json')
      .send({
        phone_number: global.phone_number,
      })
      .expect(200);
    assert(response.body.phone_hash);
    assert(typeof response.body.phone_hash === 'string');
    global.phone_hash = response.body.phone_hash;
  });
});

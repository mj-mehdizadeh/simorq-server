'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/auth/login.test.js', () => {

  it('test phone code POST /auth/login', () => {
    return request(12)
      .expect(400)
      .expect({
        name: 'invalid_phone_code',
        params: null,
      });
  });

  it('should POST /auth/login', async () => {
    const response = await request().expect(200);
    assert(response.body.login_hash);
    global.login_hash = response.body.login_hash;
  });
});

function request(phone_code = 12345) {
  return app.httpRequest()
    .post('/auth/login')
    .type('json')
    .send({
      phone_number: global.phone_number,
      phone_hash: global.phone_hash,
      phone_code,
    });
}

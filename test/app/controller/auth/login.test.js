'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/auth/login.test.js', () => {

  it('test phone code POST /auth/login', () => {
    return request()
      .expect(400)
      .expect({
        name: 'invalid_phone_code',
        params: null,
      });
  });

  it('test phone number POST /auth/login', () => {
    app.mockService('sendCode', 'validateCode', () => true);
    return request()
      .expect({
        name: 'invalid_phone_number',
        params: null,
      })
      .expect(400);
  });

  it('should POST /auth/login', () => {
    app.mockService('sendCode', 'validateCode', () => true);
    app.mockService('account', 'findByPhoneNumber', () => ({
      updateLoginHash: () => true,
      signedLoginToken: () => 'testHash',
    }));
    return request().expect({
      login_hash: 'testHash',
    })
      .expect(200);
  });
});

function request() {
  return app.httpRequest()
    .post('/auth/login')
    .type('json')
    .send({
      phone_number: 98910,
      phone_hash: 'hash',
      phone_code: 11111,
    });
}

'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/auth/send_code.test.js', () => {

  it('should POST /auth/login', () => {
    return request()
      .expect(400)
      .expect({
        name: 'invalid_phone_code',
        params: null,
      });
  });

  it('should POST validateCode /auth/login', () => {
    app.mockService('sendCode', 'validateCode', function() {
      return true;
    });
    return request()
      .expect({
        name: 'invalid_phone_number',
        params: null,
      })
      .expect(400);
  });

  it('should POST valid /auth/login', () => {
    app.mockService('sendCode', 'validateCode', function() {
      return true;
    });
    app.mockService('account', 'findByPhoneNumber', function() {
      return {
        updateLoginHash: () => true,
        signedLoginToken: () => 'testHash',
      };
    });
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

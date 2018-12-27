'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/auth/register.test.js', () => {

  it('test phone code POST /auth/register', () => {
    return request()
      .expect(400)
      .expect({
        name: 'invalid_phone_code',
        params: null,
      });
  });

  it('test phone number POST /auth/register', () => {
    app.mockService('sendCode', 'validateCode', () => true);
    app.mockService('account', 'canRegister', () => false);
    return request()
      .expect({
        name: 'invalid_phone_number',
        params: null,
      })
      .expect(400);
  });

  it('should POST /auth/register', () => {
    app.mockService('sendCode', 'validateCode', () => true);
    app.mockService('account', 'canRegister', () => true);
    app.mockService('room', 'insertRoom', () => ({ _id: '1' }));
    app.mockService('account', 'insertAccount', () => ({
      _id: '1',
      updateLoginHash: () => true,
      signedLoginToken: () => 'testHash',
    }));
    return request()
      .expect({
        login_hash: 'testHash',
      })
      .expect(200);
  });
});

function request() {
  return app.httpRequest()
    .post('/auth/register')
    .type('json')
    .send({
      phone_number: 98910,
      phone_hash: 'hash',
      phone_code: 11111,
      title: 'tester',
    });
}

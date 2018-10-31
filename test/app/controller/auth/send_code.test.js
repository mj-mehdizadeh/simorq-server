'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/auth/send_code.test.js', () => {

  it('should GET /auth/sendCode', () => {
    return app.httpRequest()
      .get('/auth/sendCode')
      .expect(404);
  });

  it('should POST /auth/sendCode', () => {
    return app.httpRequest()
      .post('/auth/sendCode')
      .type('json')
      .send({
        phone_number: 989100000000,
      })
      .expect(200);
  });
});

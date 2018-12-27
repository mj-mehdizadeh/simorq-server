'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('oauth.test.js', () => {

  it('should POST /auth/token', async () => {
    const response = await app.httpRequest()
      .post('/auth/token')
      .send(
        'grant_type=password&' +
        'username=' + global.phone_number + '&' +
        'password=' + global.login_hash + '&' +
        'client_id=123&' +
        'client_secret=112233')
      .expect(200);

    assert(response.body.refresh_token);
    assert(response.body.access_token);

    global.refresh_token = response.body.refresh_token;
    global.access_token = response.body.access_token;
  });
});

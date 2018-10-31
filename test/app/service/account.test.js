'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/account.test.js', () => {

  it('should assert', async function() {
    const ctx = app.mockContext();
    const user = await ctx.service.account.findByPhoneNumber(9891000000);
    assert(user == null);
  });

  it('should assert', async function() {
    const ctx = app.mockContext();
    const user = await ctx.service.account.insertAccount(9891000000);
    assert(user);
  });

});

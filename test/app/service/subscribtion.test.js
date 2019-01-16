'use strict';

const { app } = require('egg-mock/bootstrap');
const map = require('lodash').map;

describe('getUserSubscribes()', () => {
  // using generator function because of asynchronous invoking
  it('should test cool', async () => {
    const accountId = '5c3dc5552b8d2a34acc9b614';
    const ctx = app.mockContext();
    const subscribes = await ctx.service.subscription.getSubscribes(accountId);
    const messages = await ctx.service.message.findLastIds(map(subscribes, 'chatId'));
    console.log('messages', messages);
  });
});

'use strict';

const { app } = require('egg-mock/bootstrap');
const random = require('lodash').random;

describe('insertTest()', () => {
  // using generator function because of asynchronous invoking
  it('should test cool', async () => {
    const accountId = '5c3dc5552b8d2a34acc9b614';
    const ctx = app.mockContext();
    for (let i = 1; i < 100; i++) {
      const room = await ctx.service.room.insertRoom(`Room Test - ${i}`, 'just for test', 'GROUP', accountId);
      await ctx.service.subscription.insertSubscribe(room.id, this.accountId, 'OWNER', room.type);
      console.log('insertRoom', i);
    }

    const subscribes = await ctx.service.subscription.getSubscribes(accountId);
    const all = [];
    subscribes.forEach(async subscribe => {
      for (let i = 200; i < 400; i++) {
        all.push(ctx.model.Message.create({
          chatId: subscribe.chatId,
          randomId: random(10000000000) + i,
          text: `Message for Test - ${i}`,
          createdBy: accountId,
        }));
        console.log('subscribes', subscribe.roomId, i);
      }
    });
    await Promise.all(all);
    console.log('done');
    // const messages = await ctx.service.message.findLastIds(map(subscribes, 'chatId'));
    // console.log('messages', messages);
  });
});

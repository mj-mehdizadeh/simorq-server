'use strict';

const { app } = require('egg-mock/bootstrap');
const random = require('lodash').random;
const map = require('lodash').map;

describe('insertTest()', () => {
  // using generator function because of asynchronous invoking
  it('should test cool', async () => {
    // const accountId = '5c3dc5552b8d2a34acc9b615';
    // const ctx = app.mockContext();

    // ## rooms queries
    // const rooms = await ctx.model.Room.find({ createdBy: accountId });

    // ## subscribes queries
    // await ctx.model.Subscription.deleteMany({ createdBy: accountId });
    // const subscribes = await ctx.service.subscription.findUserSubscribes(accountId);

    // ## INSERT ROOMS
    //
    // const roomList = [];
    // for (let i = 1; i < 10000; i++) {
    //   roomList.push({
    //     title: `benchmark - ${i}`, info: 'for benchmark',
    //     type: 'GROUP',
    //     createdBy: accountId,
    //   });
    // }
    // console.time('insert rooms');
    // const rooms = await ctx.model.Room.insertMany(roomList);
    // console.timeEnd('insert rooms');

    // ## INSERT SUBSCRIBES
    //
    // const subscribes = map(rooms, room => ({
    //   roomId: room.id,
    //   chatId: room.id,
    //   createdBy: room.createdBy,
    //   role: 'OWNER',
    //   roomType: 'GROUP',
    // }));
    // console.time('insert subscribe');
    // await ctx.model.Subscription.insertMany(subscribes);
    // console.timeEnd('insert subscribe');

    // ## INSERT MESSAGES
    //
    // const messagesList = map(subscribes, subscribe => {
    //   const list = [];
    //   for (let i = 1; i <= 400; i++) {
    //     list.push({
    //       chatId: subscribe.chatId,
    //       randomId: random(11000000000) + i,
    //       text: `Message for benchmark - ${i}`,
    //       createdBy: accountId,
    //     });
    //   }
    //   return list;
    // });
    //
    // await insertMessages(0);
    // async function insertMessages(i) {
    //   if (i < messagesList.length) {
    //     console.time('insert messages - ' + i);
    //     await ctx.model.Message.insertMany(messagesList[i]);
    //     console.timeEnd('insert messages - ' + i);
    //     return insertMessages(++i);
    //   }
    // }

  });
});

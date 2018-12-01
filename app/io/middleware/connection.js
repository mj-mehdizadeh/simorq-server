'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const token = ctx.socket.handshake.query.token;
    const accountId = await ctx.service.oauthToken.getAccountId(token);
    if (accountId) {
      ctx.io.account.join(ctx.socket, accountId);
      const subscribes = await this.findUserSubscribes(accountId);
      if (subscribes) {
        subscribes.forEach(subscribe => {
          if (subscribe.chatId) {
            ctx.io.chat.join(ctx.socket, subscribe.chatId);
          } else {
            ctx.io.room.join(ctx.socket, subscribe.roomId);
          }
        });
      }
      return next();
    }
    ctx.socket.disconnect();
  };
};

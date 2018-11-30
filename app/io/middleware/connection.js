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
          if (subscribe.refId) {
            ctx.io.ref.join(ctx.socket, subscribe.refId);
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

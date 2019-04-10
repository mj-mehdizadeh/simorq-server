'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const access_token = ctx.socket.handshake.query.access_token;
    const model = await ctx.service.oauthToken.getAccessToken(access_token);
    if (model && model.accountId) {
      ctx.io().join(ctx.socket, model.accountId);
      const subscribes = await ctx.service.subscription.findUserSubscribes(model.accountId);
      if (subscribes) {
        subscribes.forEach(subscribe => {
          ctx.io().join(ctx.socket, subscribe.chatId);
        });
      }
      return next();
    }
    ctx.socket.disconnect();
  };
};

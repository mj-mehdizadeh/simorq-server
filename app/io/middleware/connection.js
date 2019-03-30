'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const token = ctx.socket.handshake.query.token;
    const model = await ctx.app.oAuth2Server.server.options.model.getAccessToken(token);
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

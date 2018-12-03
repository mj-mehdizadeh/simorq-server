'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const token = ctx.socket.handshake.query.token;
    const model = await ctx.app.oAuth2Server.server.options.model.getAccessToken(token);
    if (model.accountId) {
      ctx.io.account.join(ctx.socket, model.accountId);
      const subscribes = await this.findUserSubscribes(model.accountId);
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

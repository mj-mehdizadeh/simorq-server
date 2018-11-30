'use strict';

module.exports = () => {
  return async function(ctx, next) {

    const tokenModel = await ctx.service.oauthToken.findByToken(ctx.request.getToken());
    if (tokenModel == null || tokenModel.isRefreshTokenExpired) {
      ctx.throwError('unauthorized');
    }

    if (tokenModel.isTokenExpired) {
      ctx.throwError('access_token_expired');
    }

    ctx.request.accountId = tokenModel.accountId;

    next();
  };
};

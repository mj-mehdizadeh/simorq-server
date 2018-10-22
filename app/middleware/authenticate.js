module.exports = options => {
  return async function (ctx, next) {

    let token = ctx.request.headers['authorization'] || '';
    token = token.replace('Bearer', '');
    token = token.trim();

    const tokenModel = await ctx.service.oauthToken.findByToken(token);
    if (tokenModel == null || tokenModel.isRefreshTokenExpired) {
      throwUnauthorizedError('unauthorized');
    }
    if (tokenModel.isTokenExpired) {
      throwUnauthorizedError('access_token_expired');
    }

    ctx.request.accountId = tokenModel.accountId;

    next();

    function throwUnauthorizedError(code) {
      ctx.response.type = 'json';
      ctx.throw(401, 'Unauthorized', {
        code,
      })
    }
  }
};
'use strict';

const Service = require('egg').Service;

class OAuthTokenService extends Service {
  async findByToken(accessToken) {
    return this.ctx.model.OauthToken.findOne({ accessToken });
  }

  async findByRefreshToken(refreshToken) {
    return this.ctx.model.OauthToken.findOne({ refreshToken });
  }

  async insertToken(token, client, user) {
    return this.ctx.model.OauthToken.create({
      accountId: user.id,
      accessToken: token.accessToken,
      accessTokenExpiresOn: token.accessTokenExpiresOn,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresOn: token.refreshTokenExpiresOn,
    });
  }

  async getAccountId(accessToken) {
    const token = this.findByToken(accessToken);
    if (token == null || token.isRefreshTokenExpired || token.isTokenExpired) {
      return null;
    }
    return token.accountId;
  }
}

module.exports = OAuthTokenService;

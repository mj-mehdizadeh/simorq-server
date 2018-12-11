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
      roomId: user.roomId,
      accessToken: token.accessToken,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
    });
  }

  constructModel(params) {
    return new this.ctx.model.OauthToken(params);
  }
}

module.exports = OAuthTokenService;

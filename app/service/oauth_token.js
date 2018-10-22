'use strict';

const Service = require('egg').Service;
const generateRandomToken = require('../core/security').generateRandomToken;

class OAuthTokenService extends Service {
  async findByToken(accessToken) {
    return this.ctx.model.OauthToken.findOne({accessToken});
  }

  async findByRefreshToken(refreshToken) {
  }

  async insertToken(accountId) {
    return this.ctx.model.OauthToken.create({
      accountId,
      accessToken: await generateRandomToken(),
      refreshToken: await generateRandomToken(),
      accessTokenExpiresOn: Date.now() + this.app.config.oauth.accessTokenExpiresTime
    });
  }

  async revokeToken(accountId, accessToken) {
  }
}

module.exports = OAuthTokenService;

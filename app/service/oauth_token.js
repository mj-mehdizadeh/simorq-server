'use strict';

const Service = require('egg').Service;

class OAuthTokenService extends Service {
  async findByToken(accessToken) {
    return this.ctx.model.OauthToken.findOne({ accessToken });
  }

  async findByRefreshToken(refreshToken) {
    return this.ctx.model.OauthToken.findOne({ refreshToken });
  }

  async deleteRefreshToken(refreshToken) {
    return this.ctx.model.OauthToken.deleteOne({ refreshToken });
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

  async getAccessToken(bearerToken) {
    try {
      const verified = await this.app.jwt.verify(bearerToken, this.app.config.jwt.secret);
      const result = this.ctx.service.oauthToken.constructModel(verified);
      result.accessTokenExpiresAt = new Date(result.exp * 1000);
      result.user = this.ctx.service.account.constructModel({ _id: result.accountId, roomId: result.roomId });
      result.client = this.ctx.service.oauthClient.constructModel({ clientId: result.clientId });
      return result;
    } catch (e) {
      return null;
    }
  }

  constructModel(params) {
    return new this.ctx.model.OauthToken(params);
  }
}

module.exports = OAuthTokenService;

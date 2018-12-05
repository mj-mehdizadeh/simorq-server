'use strict';

// need implement some follow functions
module.exports = app => {
  class Model {
    constructor(ctx) {
      this.ctx = ctx;
    }

    async generateAccessToken(client, user) {
      return app.jwt.sign({
        clientId: client.clientId,
        accountId: user.id,
      },
      app.config.jwt.secret,
      {
        expiresIn: '15m',
      });
    }

    async getClient(clientId, clientSecret) {
      return this.ctx.service.oauthClient.findClient(clientId, clientSecret);
    }

    async getUser(phoneNumber, password) {
      try {
        const account = await this.ctx.service.account.findByPhoneNumber(phoneNumber);
        await account.verifyLoginToken(password);
        return account;
      } catch (e) {
        return null;
      }
    }

    async getAccessToken(bearerToken) {
      try {
        const verifyed = await app.jwt.verify(bearerToken, app.config.jwt.secret);
        verifyed.accessTokenExpiresAt = new Date(verifyed.exp * 1000);
        const result = this.ctx.service.oauthToken.constructModel(verifyed);
        result.user = this.ctx.service.account.constructModel({ id: result.accountId });
        result.client = this.ctx.service.oauthClient.constructModel({ clientId: result.clientId });
        return result;
      } catch (e) {
        return null;
      }
    }

    async getRefreshToken(refreshToken) {
      const token = await this.ctx.service.oauthToken.findByRefreshToken(refreshToken);
      if (token != null) {
        token.user = this.ctx.service.account.constructModel({ id: token.accountId });
        token.client = this.ctx.service.oauthClient.constructModel({ clientId: token.clientId });
      }
      return token;
    }

    async revokeToken(token) {
      try {
        token.accessToken = await this.generateAccessToken({ id: token.accountId }, { clientId: token.clientId });
        return true;
      } catch (e) {
        return false;
      }
    }

    async saveToken(token, client, user) {
      const tokenModel = await this.ctx.service.oauthToken.insertToken(token, client, user);
      tokenModel.client = client;
      tokenModel.user = user;
      if (user.revokeLoginHash) {
        await user.updateLoginHash(true);
      }
      return tokenModel;
    }
  }

  return Model;
};

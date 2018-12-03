'use strict';

// need implement some follow functions
module.exports = app => {
  class Model {
    constructor(ctx) {
      this.ctx = ctx;
    }

    async generateAccessToken(client, user) {
      return app.jwt.sign({
        clientId: client._id,
        accountId: user._id,
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
        const result = await app.jwt.verify(bearerToken, app.config.jwt.secret);
        result.accessTokenExpiresAt = new Date(result.exp * 1000);
        result.user = { _id: result.accountId };
        result.client = { _id: result.clientId };
        return result;
      } catch (e) {
        return null;
      }
    }

    async getRefreshToken(refreshToken) {
      const token = await this.ctx.service.oauthToken.findByRefreshToken(refreshToken);
      token.user = { _id: token.accountId };
      token.client = { id: token.clientId };
      return token;
    }

    async revokeToken(token) {
      try {
        token.accessToken = await this.generateAccessToken({ _id: token.accountId }, { _id: token.clientId });
        return true;
      } catch (e) {
        return false;
      }
    }

    async saveToken(token, client, user) {
      const tokenModel = await this.ctx.service.oauthToken.insertToken(token, client, user);
      tokenModel.client = client;
      tokenModel.user = user;
      if (user.hasOwnProperty('updateLoginHash')) {
        await user.updateLoginHash(true);
      }
      return tokenModel;
    }
  }

  return Model;
};

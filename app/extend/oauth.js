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
        roomId: user.roomId,
      },
      app.config.jwt.secret,
      {
        expiresIn: app.config.jwt.expiresIn,
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
      return this.ctx.service.oauthToken.getAccessToken(bearerToken);
    }

    async getRefreshToken(refreshToken) {
      const token = await this.ctx.service.oauthToken.findByRefreshToken(refreshToken);
      if (token != null) {
        token.user = this.ctx.service.account.constructModel({ _id: token.accountId, roomId: token.roomId });
        token.client = this.ctx.service.oauthClient.constructModel({ clientId: token.clientId });
      }
      return token;
    }

    async revokeToken(token) {
      try {
        token.accessToken = await this.generateAccessToken({ _id: token.accountId, roomId: token.roomId }, { clientId: token.clientId });
        await this.ctx.service.oauthToken.deleteRefreshToken(token.refreshToken);
        return token;
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

'use strict';

// need implement some follow functions
module.exports = app => {
  class Model {
    constructor(ctx) {
      this.ctx = ctx;
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
      const token = await this.ctx.service.oauthToken.findByToken(bearerToken);
      if (token != null) {
        token.client = await this.ctx.service.oauthClient.findById(token.clientId);
        token.user = await this.ctx.service.account.findById(token.accountId);
      }
      return token;
    }

    async saveToken(token, client, user) {
      const tokenModel = await this.ctx.service.oauthToken.insertToken(token, client, user);
      tokenModel.client = client;
      tokenModel.user = user;
      await user.updateLoginHash(true);
      return tokenModel;
    }
  }

  return Model;
};

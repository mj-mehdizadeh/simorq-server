'use strict';

const Service = require('egg').Service;

class OAuthClientService extends Service {

  findByClientId(clientId) {
    return this.ctx.model.OauthClient.findOne({ clientId });
  }

  async findClient(clientId, clientSecret) {
    const client = await this.findByClientId(clientId);
    if (!client || (client.clientSecret && client.clientSecret !== clientSecret)) {
      return null;
    }
    return client;
  }

  constructModel(params) {
    return new this.ctx.model.OauthClient(params);
  }
}

module.exports = OAuthClientService;

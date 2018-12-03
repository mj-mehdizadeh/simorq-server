'use strict';

const Service = require('egg').Service;

class OAuthClientService extends Service {
  findById(id) {
    return this.ctx.model.OauthClient.findById(id);
  }

  findByClientId(clientId) {
    return this.ctx.model.OauthClient.findOne({ clientId });
  }

  async findClient(clientId, clientSecret) {
    const client = await this.findByClientId(clientId);
    if (client && client.clientSecret != null && client.clientSecret !== clientSecret) {
      return null;
    }
    return client;
  }
}

module.exports = OAuthClientService;

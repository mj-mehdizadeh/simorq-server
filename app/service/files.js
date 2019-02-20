'use strict';

const Service = require('egg').Service;

class FilesService extends Service {

  findByToken(token) {
    return this.ctx.model.Files.findOne({ token });
  }

  findByTokens(tokens) {
    return this.ctx.model.Files.find({ token: { $in: tokens } });
  }

  insertFile(params) {
    return this.ctx.model.Files.create(params);
  }

  constructModel(params) {
    return new this.ctx.model.Files(params);
  }
}

module.exports = FilesService;

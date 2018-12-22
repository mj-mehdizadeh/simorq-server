'use strict';

const Service = require('egg').Service;

class FilesService extends Service {

  findByPhoneNumber(token) {
    return this.ctx.model.Files.findOne({ token });
  }

  insertFile(params) {
    return this.ctx.model.Files.create(params);
  }

  constructModel(params) {
    return new this.ctx.model.Files(params);
  }
}

module.exports = FilesService;

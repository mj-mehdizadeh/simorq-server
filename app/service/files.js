'use strict';

const Service = require('egg').Service;

class FilesService extends Service {

  findByPhoneNumber(token) {
    return this.ctx.model.Files.findOne({ token });
  }

  insertFile(params) {
    return this.ctx.model.Files.create(params);
  }
}

module.exports = FilesService;

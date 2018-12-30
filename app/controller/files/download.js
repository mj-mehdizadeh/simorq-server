'use strict';

const fs = require('fs');
const Controller = require('../../core/controller');

class DownloadController extends Controller {

  presentable(result) {
    return result;
  }
  async handle() {
    const file = await this.ctx.service.files.findByToken(this.ctx.params.token);
    if (file === null) {
      this.throwInvalidError('invalid_token');
    }
    const target = file.target(this.ctx.params.size);
    if (!fs.existsSync(target)) {
      this.throwInvalidError('file_not_exist');
    }
    this.ctx.set('Content-Type', file.mimeType);
    this.ctx.attachment(file.name);

    return fs.createReadStream(target);
  }
}

module.exports = DownloadController;

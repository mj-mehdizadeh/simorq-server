'use strict';

const fs = require('fs');
const path = require('path');
const mapValues = require('lodash').mapValues;
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
    const target = path.join(
      file.targetPath,
      this.ctx.params.name
    );
    if (!fs.existsSync(target)) {
      this.throwInvalidError('file_not_exist');
    }
    if (mapValues(this.app.config.files.thumbs,
      thumb => thumb.name).includes(this.ctx.params.name)) {
      this.ctx.set('Content-Type', 'image/png');
    } else {
      this.ctx.set('Content-Type', file.mimeType);
    }
    this.ctx.attachment(this.ctx.params.name);

    return fs.createReadStream(target);
  }
}

module.exports = DownloadController;

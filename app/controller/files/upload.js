'use strict';

const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Controller = require('../../core/controller');
const mkdirp = require('mkdirp');
const uuid4 = require('uuid4');

class UploadController extends Controller {

  async handle() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();
    const filename = path.basename(stream.filename),
      token = uuid4(),
      createdAt = new Date();


    const dirPath = path.join(
      this.config.baseDir,
      'uploads',
      createdAt.getFullYear().toString(),
      createdAt.getMonth().toString(),
      createdAt.getDay().toString(),
      token
    );
    await mkdirp.sync(dirPath);

    const target = path.join(dirPath, filename);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);

    await this.ctx.service.files.insertFile({
      name: filename,
      token,
      mimeType: stream.mimeType,
      createdBy: this.accountId,
      createdAt,
    });

    return {
      token,
    };
  }

}

module.exports = UploadController;

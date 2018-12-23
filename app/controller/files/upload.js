'use strict';

const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Controller = require('../../core/controller');
const mkdirp = require('mkdirp');
const uuid4 = require('uuid4');
const ffmpeg = require('fluent-ffmpeg');
const find = require('lodash').find;
const mm = require('music-metadata');

class UploadController extends Controller {

  async handle() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();

    const model = this.ctx.service.files.constructModel({
      name: path.basename(stream.filename),
      token: uuid4(),
      mimeType: stream.mimeType,
      createdBy: this.accountId,
      createdAt: new Date(),
    });

    await mkdirp.sync(model.targetPath);
    const writeStream = fs.createWriteStream(model.target());
    await pump(stream, writeStream);

    model.size = fs.statSync(model.target()).size;
    try {
      if (model.mimeType.startsWith('video')) {
        await this.processVideo(model);
      } else if (model.mimeType.startsWith('audio')) {
        await this.processAudio(model);
      }
    } catch (e) {
      console.log('process thumbnails error', e);
    }

    await model.save();

    return {
      token: model.token,
    };
  }

  async processVideo(model) {
    await ffmpeg(model.target())
      .screenshots({
        folder: model.targetPath,
        filename: this.app.config.files.thumbs.medium.name,
        timestamps: [ '5%' ],
        count: 1,
        size: this.app.config.files.thumbs.medium.size,
      });
    await new Promise(resolve => {
      ffmpeg.ffprobe(model.target(), function(err, data) {
        const stream = find(data.streams, { codec_type: 'video' });
        if (stream) {
          model.width = stream.width;
          model.height = stream.height;
          model.duration = stream.duration;
        }
        resolve();
      });
    });
  }

  async processAudio(model) {
    const metadata = await mm.parseFile(model.target(), { native: true });
    try {
      if (metadata.common.picture) {
        await fs.writeFile(model.target('MEDIUM'), metadata.common.picture.pop().data);
      }
    } finally {
      model.duration = metadata.duration;
    }
  }
}

module.exports = UploadController;

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
const sharp = require('sharp');
const Promise = require('bluebird');

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
      if (model.mimeType.startsWith('image')) {
        await this.processImage(model);
        await this.pushThumb(model);
      } else if (model.mimeType.startsWith('video')) {
        await this.processVideo(model);
        await this.pushThumb(model);
      } else if (model.mimeType.startsWith('audio')) {
        await this.processAudio(model);
        await this.pushThumb(model);
      }
    } catch (e) {
      console.log('process thumbnails error', e);
    }

    await model.save();

    return {
      token: model.token,
    };
  }

  async pushThumb(model, selector = 'MEDIUM') {
    const thumbMeta = await sharp(model.target(selector)).metadata();
    model.thumbs.push({
      selector,
      size: fs.statSync(model.target(selector)).size,
      width: thumbMeta.width,
      height: thumbMeta.height,
    });
  }

  async processImage(model, selector = 'MEDIUM') {
    const metadata = await sharp(model.target()).metadata();
    model.width = metadata.width;
    model.height = metadata.height;

    const horizontal = metadata.width > metadata.height;
    if ((horizontal && (model.height * 320) / model.width < 100) || (
      horizontal && (model.width * 320) / model.height < 100
    )) {
      return;
    }

    const readableStream = fs.createReadStream(model.target());
    const writeStream = fs.createWriteStream(model.target(selector));

    const resize = sharp()
      .resize(
        horizontal ? 320 : null,
        horizontal ? null : 320
      ).png();

    readableStream
      .pipe(resize)
      .pipe(writeStream);

    return new Promise(resolve => {
      writeStream
        .on('finish', function() {
          resolve();
        });
    });
  }

  async processVideo(model) {
    const ffprobe = Promise.promisify(ffmpeg.ffprobe);
    await new Promise(resolve => {
      ffmpeg(model.target())
        .on('end', function() {
          resolve();
        })
        .screenshots({
          folder: model.targetPath,
          filename: this.app.config.files.thumbs.medium.name,
          timestamps: [ '5%' ],
          count: 1,
          size: this.app.config.files.thumbs.medium.size,
        });
    });
    const data = await ffprobe(model.target());
    const stream = find(data.streams, { codec_type: 'video' });
    if (stream) {
      model.width = stream.width;
      model.height = stream.height;
      model.duration = stream.duration;
    }
  }

  async processAudio(model) {
    const writeFile = Promise.promisify(fs.writeFile);
    const metadata = await mm.parseFile(model.target(), { native: true });
    model.duration = metadata.duration;
    if (metadata.common.picture) {
      return writeFile(model.target('MEDIUM'), metadata.common.picture.pop().data);
    }
  }
}

module.exports = UploadController;

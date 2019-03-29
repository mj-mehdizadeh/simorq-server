'use strict';
const path = require('path');
const keyBy = require('lodash').keyBy;
const map = require('lodash').map;

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const FilesSchema = new Schema({
    name: { type: String, maxlength: 256, trim: true },
    token: { type: String, maxlength: 64, index: true },
    mimeType: { type: String, maxlength: 64 },
    size: { type: Number },
    width: Number,
    height: Number,
    duration: Number,
    thumbs: [ new Schema({
      selector: {
        type: String,
        enum: [ 'LARGE', 'MEDIUM', 'SMALL' ],
      },
      size: Number,
      width: Number,
      height: Number,
    }, { _id: false }) ],
    createdBy: { type: Schema.Types.ObjectId },
    createdAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  });

  FilesSchema.virtual('targetPath').get(function() {
    return path.join(
      app.baseDir,
      app.config.files.localPath,
      this.createdAt.getFullYear().toString(),
      this.createdAt.getMonth().toString(),
      this.createdAt.getUTCDate().toString(),
      this.token
    );
  });

  FilesSchema.methods.target = function(selector) {
    return path.join(
      this.targetPath,
      selector ? app.config.files.thumbs[selector.toLowerCase()].name :
        this.name
    );
  };

  FilesSchema.methods.presentable = function() {
    return {
      name: this.name,
      uri: `${app.config.files.baseUri}/${this.token}/${this.name}`,
      token: this.token,
      mimeType: this.mimeType,
      size: this.size,
      width: this.width,
      height: this.height,
      duration: this.duration,
      thumbs: keyBy(map(
        this.thumbs,
        thumb => ({
          selector: thumb.selector,
          size: thumb.size,
          width: thumb.width,
          height: thumb.height,
          uri: `${app.config.files.baseUri}/${this.token}/${app.config.files.thumbs[thumb.selector.toLowerCase()].name}`,
        })
      ), thumb => thumb.selector.toLowerCase()),
    };
  };

  return mongoose.model('Files', FilesSchema, 'files');
};

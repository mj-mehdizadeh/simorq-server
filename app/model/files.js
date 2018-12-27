'use strict';
const path = require('path');

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
    return path.join(this.targetPath, selector ?
      app.config.files.thumbs[selector.toLowerCase()].name :
      this.name);
  };

  FilesSchema.methods.presentable = function() {
    return {
      name: this.name,
      token: this.token,
      mimeType: this.mimeType,
      size: this.size,
      width: this.width,
      height: this.height,
      duration: this.duration,
      thumbs: this.thumbs,
    };
  };

  return mongoose.model('Files', FilesSchema, 'files');
};

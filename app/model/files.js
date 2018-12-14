'use strict';

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
    thumbs: [ new Schema({
      selector: {
        type: String,
        enum: [ 'LARGE', 'MEDIUM', 'SMALL' ],
      },
      mimeType: { type: String, maxlength: 64 },
      size: Number,
      width: Number,
      height: Number,
    }, { _id: false }) ],
    createdBy: { type: Schema.Types.ObjectId },
    createdAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Files', FilesSchema, 'files');
};

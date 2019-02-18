'use strict';
const generateRandomToken = require('../core/security').generateRandomToken;

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AccountSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, index: true },
    phoneNumber: { type: Number, index: true },
    email: { type: String, maxlength: 256, trim: true, default: null },
    passwordHash: { type: String, default: null },
    loginHash: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  AccountSchema.methods.signedLoginToken = function() {
    return app.jwt.sign({
      hash: this.loginHash,
      phone_number: this.phoneNumber,
    },
    app.config.jwt.secret,
    {
      expiresIn: '15m',
    });
  };

  AccountSchema.methods.verifyLoginToken = async function(token) {
    const result = await app.jwt.verify(token, app.config.jwt.secret);
    if (result.phone_number !== this.phoneNumber || result.hash !== this.loginHash) {
      throw new Error('Verify Error');
    }
    this.revokeLoginHash = true;
  };

  AccountSchema.methods.updateLoginHash = async function(clear = false) {
    const loginHash = clear ? null : await generateRandomToken();
    this.set({ loginHash });
    return this.save();
  };

  AccountSchema.methods.presentable = function() {
    return {
      id: this.id,
      roomId: this.roomId,
      phoneNumber: this.phoneNumber,
      email: this.email,
      isDeleted: this.isDeleted,
      hasPassword: !!this.passwordHash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  return mongoose.model('Account', AccountSchema, 'account');
};

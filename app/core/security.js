'use strict';

const crypto = require('crypto');
const randomBytes = require('bluebird').promisify(crypto.randomBytes);


function md5(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function sha256Hex(input) {
  return sha256(hex2a(input));
}

function hex2a(hexx) {
  const hex = hexx.toString();
  let str = '';
  for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

function generateRandomToken() {
  return randomBytes(256).then(function(buffer) {
    return crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');
  });
}

exports.md5 = md5;
exports.sha256 = sha256;
exports.hex2a = hex2a;
exports.sha256Hex = sha256Hex;
exports.generateRandomToken = generateRandomToken;

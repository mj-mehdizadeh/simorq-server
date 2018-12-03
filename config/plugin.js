'use strict';

// had enabled by egg
// exports.static = true;
exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
exports.oAuth2Server = {
  enable: true,
  package: 'egg-oauth2-server',
};
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

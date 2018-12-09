'use strict';

const io = require('./io');

module.exports = {
  throwError(name, params, status = 400) {
    this.response.type = 'json';
    this.throw(status, {
      name,
      params,
    });
  },
  io,
};

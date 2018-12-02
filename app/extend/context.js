'use strict';

const io = require('./io');

module.exports = {
  throwError(code, params, status = 400) {
    this.response.type = 'json';
    this.throw(status, 'Bad Request', {
      code,
      params,
    });
  },
  io,
};

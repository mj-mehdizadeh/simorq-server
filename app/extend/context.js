'use strict';

module.exports = {
  throwError(code, params) {
    this.response.type = 'json';
    this.throw(400, 'Bad Request', {
      code,
      params,
    });
  },
};

'use strict';

module.exports = {
  getToken() {
    const token = this.get('Authorization');
    const matches = token.match(/Bearer\s(\S+)/);
    if (!matches) {
      return false;
    }
    return matches[1];
  },
};

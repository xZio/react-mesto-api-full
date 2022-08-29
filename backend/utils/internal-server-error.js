const { INTERNAL_SERVER_ERROR } = require('./errors');

module.exports = class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
};

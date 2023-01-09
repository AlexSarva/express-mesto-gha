class NotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotExistError';
    this.statusCode = 404;
  }
}

module.exports = NotExistError;

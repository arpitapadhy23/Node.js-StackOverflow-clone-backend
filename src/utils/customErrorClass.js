class customError extends Error {
  constructor(message, data, statusCode) {
    super(message);
    this.data = data;
    this.statusCode = statusCode;
  }
}

module.exports = { customError };

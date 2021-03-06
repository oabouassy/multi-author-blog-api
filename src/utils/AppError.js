module.exports = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode === 400 ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(AppError);
  }
};

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode,
    error: {
      message: err.message,
      data: err.data,
    },
  });
};
module.exports = { globalErrorHandler };

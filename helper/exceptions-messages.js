const exceptionMessage = (res, statusCode, message) =>
  res.status(statusCode).json({
    message,
  });

module.exports = exceptionMessage;

const exceptionMessage = (res, statusCode, message) => {
  return res.status(statusCode).json({
    message,
  });
};

module.exports = exceptionMessage;

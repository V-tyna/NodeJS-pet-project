module.exports = (message, e) => {
  console.log(message, e);
    const error = new Error({
      error: e,
      message,
    });
    error.httpStatusCode = 500;
    return next(error);
};

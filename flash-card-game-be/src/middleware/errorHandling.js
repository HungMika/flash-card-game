const errorHandling = (err, req, res, next) => {
  const errStatus = 500;
  const errMessage = 'Internal server error!';

  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
};

module.exports = errorHandling;

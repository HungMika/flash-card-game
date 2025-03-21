const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'You must be login!' });
    }

    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid!' });
      }

      req.user = payload;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;

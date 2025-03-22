const User = require('../models/User');

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;

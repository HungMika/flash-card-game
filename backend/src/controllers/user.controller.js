const User = require('../models/User');

const userController = {
  // [GET] /user/show/all
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  // [GET] /user/profile
  profile: async (req, res, next) => {
    try {
      const userId = req.cookies?.userId;
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }

      const { _id, password, ...others } = user._doc;

      return res.status(200).json({ ...others });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;

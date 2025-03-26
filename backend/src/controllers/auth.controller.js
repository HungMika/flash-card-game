const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { validateRegister, validateLogin } = require('../utils/auth');

require('dotenv').config();
const cookiesSecure = process.env.COOKIES_SECURE === 'true';

const authController = {
  // [POST] /auth/register
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      await validateRegister(username, email, password);

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // save user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      return res.status(201).json({ message: 'Register successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [GET] /auth/login
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await validateLogin(username, password);
      if (user) {
        // generate token
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: '30d' },
        );

        // store token in cookies
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: cookiesSecure,
          sameSite: 'None',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30d * 24h * 60m * 60s * 1000 (ms)
        });

        const { _id, password, ...others } = user._doc;
        res.cookie('userId', _id, {
          httpOnly: true,
          secure: cookiesSecure,
          sameSite: 'None',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30d * 24h * 60m * 60s * 1000 (ms)
        });

        return res.status(200).json({ ...others });
      }
    } catch (error) {
      next(error);
    }
  },

  // [POST] /auth/logout
  logout: async (req, res, next) => {
    try {
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: cookiesSecure,
        sameSite: 'None',
      });
      res.clearCookie('userId', {
        httpOnly: true,
        secure: cookiesSecure,
        sameSite: 'None',
      });
      return res.status(200).json({ message: 'Log out successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;

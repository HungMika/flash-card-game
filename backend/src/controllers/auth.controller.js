const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { validateRegister, validateLogin } = require('../utils/auth');
const { APIError } = require('../error');

require('dotenv').config();

const authController = {
  // [POST] /auth/register
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      await validateRegister(username, email, password);
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
          { expiresIn: '30s' },
        );
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: '300s' },
        );

        // store token in cookies
        res.cookie('accessToken', accessToken, {
          // httpOnly: true,
          // secure: true,
          // path: '/',
          // sameSite: 'Strict',
        });

        res.cookie('refreshToken', refreshToken, {
          // httpOnly: true,
          // secure: true,
          // path: '/',
          // sameSite: 'Strict',
        });

        const { password, ...others } = user._doc;

        return res.status(200).json({ ...others });
      }
    } catch (error) {
      next(error);
    }
  },

  // [POST] /auth/refresh
  refreshToken: async (req, res, next) => {
    try {
      // take refresh token form user
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new APIError('You must be login!', 401);
      }

      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
        if (err) {
          throw new APIError('Invalid refresh token!', 403);
        }

        // generate new token
        const newAccessToken = jwt.sign(
          { id: payload.id },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: '30s' },
        );
        const newRefreshToken = jwt.sign(
          { id: payload.id },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: '300s' },
        );

        // store token in cookies
        res.cookie('accessToken', newAccessToken, {
          // httpOnly: true,
          // secure: true,
          // path: '/',
          // sameSite: 'Strict',
        });

        res.cookie('refreshToken', newRefreshToken, {
          // httpOnly: true,
          // secure: true,
          // path: '/',
          // sameSite: 'Strict',
        });

        return res.status(200).json({
          message: 'Refresh token successfully!',
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /auth/logout
  logout: async (req, res, next) => {
    try {
      res.clearCookie('accessToken', {
        // httpOnly: true,
        // secure: true,
        // path: '/',
        // sameSite: 'Strict',
      });
      res.clearCookie('refreshToken', {
        // httpOnly: true,
        // secure: true,
        // path: '/',
        // sameSite: 'Strict',
      });
      return res.status(200).json({ message: 'Log out successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;

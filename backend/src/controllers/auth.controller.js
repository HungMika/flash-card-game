const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { validateRegister, validateLogin } = require('../utils/auth');

require('dotenv').config();

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
          { expiresIn: '1h' },
        );
        // const refreshToken = jwt.sign(
        //   { id: user._id },
        //   process.env.JWT_REFRESH_KEY,
        //   { expiresIn: '7d' },
        // );

        // store token in cookies
        res.cookie('accessToken', accessToken, {
          // httpOnly: true,
          // secure: true,
          // sameSite: 'Strict',
        });

        // res.cookie('refreshToken', refreshToken, {
        //   // httpOnly: true,
        //   // secure: true,
        //   // sameSite: 'Strict',
        // });

        const { _id, password, ...others } = user._doc;
        res.cookie('userId', _id, {
          // httpOnly: true,
          // secure: true,
          // sameSite: 'Strict',
        });

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
        return res.status(401).json({ message: 'You must be login!' });
      }

      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token!' });
        }

        // generate new token
        const newAccessToken = jwt.sign(
          { id: payload.id },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: '1h' },
        );
        const newRefreshToken = jwt.sign(
          { id: payload.id },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: '7d' },
        );

        // store token in cookies
        res.cookie('accessToken', newAccessToken, {
          // httpOnly: true,
          // secure: true,
          // sameSite: 'Strict',
        });

        res.cookie('refreshToken', newRefreshToken, {
          // httpOnly: true,
          // secure: true,
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
        // sameSite: 'Strict',
      });
      // res.clearCookie('refreshToken', {
      //   // httpOnly: true,
      //   // secure: true,
      //   // sameSite: 'Strict',
      // });
      res.clearCookie('userId', {
        // httpOnly: true,
        // secure: true,
        // sameSite: 'Strict',
      });
      return res.status(200).json({ message: 'Log out successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;

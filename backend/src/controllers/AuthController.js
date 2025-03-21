const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

require('dotenv').config();

const authController = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: '1h',
      },
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: '30d',
      },
    );
  },

  // [POST] /auth/register
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // validate register input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields!' });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid!' });
      }
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: 'Password must have at least 8 characters' });
      }

      // if user already exists
      const existingUser = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (existingUser) {
        if (username === existingUser.username) {
          return res.status(400).json({ message: 'Username already exists!' });
        }
        if (email === existingUser.email) {
          return res.status(400).json({ message: 'Email already exists!' });
        }
      }

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

      // check user fill username or password
      if (!username || !password) {
        return res.status(400).json({ message: 'Please fill all the fields!' });
      }

      // find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'Invalid username!' });
      }

      // check password
      const isMatchPassword = bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return res.status(401).json({ message: 'Invalid password!' });
      }

      if (user && isMatchPassword) {
        // generate token
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);

        // save token to cookies
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

  refreshToken: async (req, res, next) => {
    try {
      // take refresh token form user
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
        if (err) {
          return res
            .status(403)
            .json({ message: 'Refresh token is not valid!' });
        }

        const newAccessToken = authController.generateAccessToken(payload);
        const newRefreshToken = authController.generateRefreshToken(payload);

        // save token to cookies
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

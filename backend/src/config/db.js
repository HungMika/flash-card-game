const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DATABASE_URI;

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log('connect successfully!');
  } catch (error) {
    console.error('connect failure!');
  }
};

module.exports = { connect };

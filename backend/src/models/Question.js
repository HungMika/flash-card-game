const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    wrongAnswer: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Question', questionSchema);

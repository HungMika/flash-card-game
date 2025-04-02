const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [
      {
        type: ObjectId,
        ref: 'Question',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Subject', subjectSchema);

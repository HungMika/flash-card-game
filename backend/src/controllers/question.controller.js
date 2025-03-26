const { default: mongoose } = require('mongoose');
const Question = require('../models/Question');
const Subject = require('../models/Subject');

const questionController = {
  // [POST] /question/create
  create: async (req, res, next) => {
    try {
      const { subjectId } = req.params;
      const { title, correctAnswer, wrongAnswer } = req.body;

      // create question
      const question = new Question({
        subjectId,
        title,
        correctAnswer,
        wrongAnswer,
      });
      await question.save();

      // push question to subject
      const subject = await Subject.findByIdAndUpdate(
        { _id: subjectId },
        { $push: { questions: question._id } },
        {
          timestamps: true,
          new: true,
        },
      );

      return res.status(200).json({ question, subject });
    } catch (error) {
      next(error);
    }
  },

  // [GET] /question/show/all/:subjectId
  showAll: async (req, res, next) => {
    try {
      const { subjectId } = req.params;

      const questions = await Question.find({ subjectId }).lean();
      if (!questions.length) {
        return res.status(404).json({ message: 'No questions found!' });
      }

      return res.status(200).json(questions);
    } catch (error) {
      next(error);
    }
  },

  // [PATCH] /question/update/:questionId
  update: async (req, res, next) => {
    try {
      const { questionId } = req.params;
      const { title, correctAnswer, wrongAnswer } = req.body;

      // check for valid questionId
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: 'Invalid questionId!' });
      }

      const question = await Question.findByIdAndUpdate(
        { _id: questionId },
        {
          title,
          correctAnswer,
          wrongAnswer,
        },
        {
          new: true,
        },
      );
      if (!question) {
        return res.status(404).json({ message: 'Question not found!' });
      }

      return res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  },

  // [DELETE] /question/delete/:questionId
  delete: async (req, res, next) => {
    try {
      const { questionId } = req.params;

      // check for valid questionId
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: 'Invalid questionId!' });
      }

      const question = await Question.findByIdAndDelete({ _id: questionId });
      if (!question) {
        return res.status(404).json({ message: 'Question not found!' });
      }

      return res.status(200).json({ message: 'Delete question successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = questionController;

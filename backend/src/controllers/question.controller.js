const Question = require('../models/Question');
const Subject = require('../models/Subject');

const questionController = {
  // [POST] /question/create
  create: async (req, res, next) => {
    try {
      const { subjectId } = req.params;
      const { name, correctAnswer, wrongAnswer } = req.body;

      // create question
      const question = new Question({
        subjectId,
        name,
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
};

module.exports = questionController;

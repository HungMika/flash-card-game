const Subject = require('../models/Subject');

const subjectController = {
  // [POST] /subject/create
  create: async (req, res, next) => {
    try {
      const userId = req.cookies?.userId;
      const { name, group } = req.body;

      // check existing name
      const existingName = await Subject.findOne({ name });
      if (existingName) {
        return res
          .status(400)
          .json({ message: 'Subject name already exists!' });
      }

      // save subject
      const subject = new Subject({
        userId,
        name,
        group,
      });
      await subject.save();

      return res.status(200).json(subject);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = subjectController;

const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Question = require('../models/Question');

const subjectController = {
  // [POST] /subject/create
  create: async (req, res, next) => {
    try {
      const userId = req.cookies?.userId;
      const { name, group } = req.body;

      // check existing name
      const subjectInGroup = await Subject.findOne({ name, group });
      if (subjectInGroup) {
        return res
          .status(400)
          .json({ message: 'Subject name already exists in this group!' });
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

  // [GET] /subject/show/all
  showAll: async (req, res, next) => {
    try {
      const subjects = await Subject.find().lean();
      if (!subjects) {
        return res.status(404).json({ message: 'No subjects found!' });
      }

      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  },

  // [GET] /subject/show/:group
  showByGroup: async (req, res, next) => {
    try {
      const { group } = req.params;
      const subjects = await Subject.find({ group }).lean();
      if (!subjects.length) {
        return res.status(404).json({ message: 'No subjects found!' });
      }

      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  },

  // [GET] /subject/show
  show: async (req, res, next) => {
    try {
      const userId = req.cookies?.userId;

      // find by userId
      const subjects = await Subject.find({ userId }).lean();
      if (!subjects.length) {
        return res.status(404).json({ message: 'No subjects found!' });
      }

      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  },

  // [POST] /subject/search
  search: async (req, res, next) => {
    try {
      const { query } = req.body;

      const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexPattern = new RegExp(safeQuery, 'i');

      const subjects = await Subject.find({
        name: { $regex: regexPattern },
      }).lean();
      if (!subjects.length) {
        return res.status(404).json({ message: 'Subject not found!' });
      }

      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  },

  // [PATCH] /subject/update/:subjectId
  update: async (req, res, next) => {
    try {
      const userId = req.cookies?.userId;
      const { subjectId } = req.params;
      const { name, group } = req.body;

      // check for valid subjectId
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({ message: 'Invalid subjectId!' });
      }

      const subjectInGroup = await Subject.findOne({ name, group });
      if (subjectInGroup) {
        return res
          .status(400)
          .json({ message: 'Subject name already exists in this group!' });
      }

      // update subject
      const subject = await Subject.findOneAndUpdate(
        { _id: subjectId, userId },
        { name, group },
        { new: true },
      ).lean();
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found!' });
      }

      return res.status(200).json(subject);
    } catch (error) {
      next(error);
    }
  },

  // [DELETE] /subject/delete/:subjectId
  delete: async (req, res, next) => {
    try {
      const userId = req.cookies?.userId;
      const { subjectId } = req.params;

      // check for valid subjectId
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({ message: 'Invalid subjectId!' });
      }

      // find subject
      const subject = await Subject.findOne({ _id: subjectId, userId });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found!' });
      }

      // delete all questions of subject
      await Question.deleteMany({ subjectId });
      // delete subject
      await Subject.findOneAndDelete({ _id: subjectId, userId });

      return res.status(200).json({ message: 'Delete successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = subjectController;

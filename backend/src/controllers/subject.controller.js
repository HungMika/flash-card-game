const mongoose = require('mongoose');
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

  // [GET] /subject/show/all
  showAll: async (req, res, next) => {
    try {
      const subjects = await Subject.find().lean().select('-questions');
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
      const subjects = await Subject.find({ group })
        .lean()
        .select('-questions');
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
      const subjects = await Subject.find({ userId })
        .lean()
        .select('-questions');
      if (!subjects.length) {
        return res.status(404).json({ message: 'No subjects found!' });
      }

      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  },

  // [GET] /subject/search
  search: async (req, res, next) => {
    try {
      const { query } = req.body;

      const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexPattern = new RegExp(safeQuery, 'i');

      const subjects = await Subject.find({ name: { $regex: regexPattern } })
        .lean()
        .select('-questions');

      if (!subjects.length) {
        return res.status(404).json({ message: 'Subject not found!' });
      }

      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  },

  // [PATCH] /subject/update
  update: async (req, res, next) => {
    try {
      const { subjectId } = req.params;
      const { name, group } = req.body;

      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({ message: 'Invalid subjectId!' });
      }

      const subjects = await Subject.findByIdAndUpdate(
        { _id: subjectId },
        { name, group },
        { new: true },
      )
        .lean()
        .select('-questions');

      return res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = subjectController;

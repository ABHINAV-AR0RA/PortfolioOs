const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  layout: {
    type: String,
    default: 'default',
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  order: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Section', sectionSchema);

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    default: "No reason specified"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;

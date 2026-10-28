const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['Casual Leave', 'Sick Leave', 'Privilege Leave', 'Maternity/Paternity'],
    default: 'Casual Leave',
  },
  startDate: {
    type: Date,
    required: [true, 'Please specify start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify end date'],
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for leave application'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  approverRole: {
    type: String,
    enum: ['HR', 'Manager'],
    default: 'HR',
  },
  approverRemarks: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Leave', leaveSchema);

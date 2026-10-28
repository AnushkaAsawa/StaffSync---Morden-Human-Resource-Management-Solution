const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide training program title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide training description and learning outcomes'],
    },
    date: {
      type: Date,
      required: [true, 'Please schedule the training date and time'],
    },
    durationHours: {
      type: Number,
      default: 2,
    },
    trainer: {
      type: String,
      required: [true, 'Please provide the trainer or lead name'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Training', trainingSchema);

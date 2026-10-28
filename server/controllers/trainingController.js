const Training = require('../models/Training');

// @desc    Get training sessions (Manager/HR gets all, Employee gets assigned)
// @route   GET /api/trainings
// @access  Private
exports.getTrainings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Employee') {
      // Employee sees trainings assigned to them or created for them
      query.$or = [{ assignedTo: req.user._id }, { assignedTo: { $size: 0 } }];
    }

    const trainings = await Training.find(query)
      .populate('createdBy', 'name role')
      .populate('assignedTo', 'name email department')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: trainings.length,
      data: trainings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new training session (Manager, HR)
// @route   POST /api/trainings
// @access  Private (Manager, HR)
exports.createTraining = async (req, res) => {
  try {
    const { title, description, date, durationHours, trainer, assignedTo } = req.body;

    if (!title || !description || !date || !trainer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, date, and trainer name',
      });
    }

    const training = await Training.create({
      title,
      description,
      date,
      durationHours: durationHours || 2,
      trainer,
      createdBy: req.user._id,
      assignedTo: assignedTo || [],
    });

    const populated = await Training.findById(training._id)
      .populate('createdBy', 'name role')
      .populate('assignedTo', 'name email department');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update training session details or status
// @route   PUT /api/trainings/:id
// @access  Private (Manager, HR)
exports.updateTraining = async (req, res) => {
  try {
    let training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training program not found' });
    }

    training = await Training.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name role')
      .populate('assignedTo', 'name email department');

    res.status(200).json({
      success: true,
      data: training,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete training session
// @route   DELETE /api/trainings/:id
// @access  Private (Manager, HR)
exports.deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    await training.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Training session deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

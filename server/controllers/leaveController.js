const Leave = require('../models/Leave');

// @desc    Get leave applications (Employee sees own, HR/Manager sees all/team)
// @route   GET /api/leaves
// @access  Private
exports.getLeaves = async (req, res) => {
  try {
    let query = {};

    // Regular employee only views their own leaves
    if (req.user.role === 'Employee') {
      query.user = req.user._id;
    }

    const leaves = await Leave.find(query)
      .populate('user', 'name email department role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
// @access  Private (Employee, Manager, HR)
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'Please provide start date, end date, and reason' });
    }

    const leave = await Leave.create({
      user: req.user._id,
      leaveType: leaveType || 'Casual Leave',
      startDate,
      endDate,
      reason,
      status: 'Pending',
    });

    const populatedLeave = await Leave.findById(leave._id).populate('user', 'name email department role');

    res.status(201).json({
      success: true,
      data: populatedLeave,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update leave status (Approve/Reject) by HR or Manager
// @route   PUT /api/leaves/:id/status
// @access  Private (HR, Manager)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave application not found' });
    }

    leave.status = status;
    leave.approverRole = req.user.role;
    if (remarks) {
      leave.approverRemarks = remarks;
    }

    await leave.save();
    const updated = await Leave.findById(leave._id).populate('user', 'name email department role');

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

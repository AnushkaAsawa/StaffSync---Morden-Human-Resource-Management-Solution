const Attendance = require('../models/Attendance');

// Helper to get current IST date string (YYYY-MM-DD)
const getISTDateString = () => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(Date.now() + istOffset);
  return istDate.toISOString().split('T')[0];
};

// @desc    Get attendance records (Employee gets own, Manager/HR gets team/all)
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    let query = {};
    const { date, user } = req.query;

    if (req.user.role === 'Employee') {
      query.user = req.user._id;
    } else if (user) {
      query.user = user;
    }

    if (date) {
      query.date = date;
    }

    const records = await Attendance.find(query)
      .populate('user', 'name email department role')
      .sort({ date: -1, checkInTime: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clock-in / Punch-in for today in IST
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const todayIST = getISTDateString();
    const now = new Date();

    // Check if user already clocked in today
    let record = await Attendance.findOne({ user: req.user._id, date: todayIST });

    if (record && record.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked in for today in IST',
        data: record,
      });
    }

    if (!record) {
      record = new Attendance({
        user: req.user._id,
        date: todayIST,
        checkInTime: now,
        status: 'Present',
      });
    } else {
      record.checkInTime = now;
      record.status = 'Present';
    }

    await record.save();
    const populated = await Attendance.findById(record._id).populate('user', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Clock-in successful (IST)',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Clock-out / Punch-out for today in IST
// @route   POST /api/attendance/check-out
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const todayIST = getISTDateString();
    const now = new Date();

    const record = await Attendance.findOne({ user: req.user._id, date: todayIST });

    if (!record || !record.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'No check-in record found for today. Please clock-in first.',
      });
    }

    if (record.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked out for today',
        data: record,
      });
    }

    record.checkOutTime = now;
    const durationHours = (now - new Date(record.checkInTime)) / (1000 * 60 * 60);
    record.totalHours = parseFloat(durationHours.toFixed(2));

    if (record.totalHours < 4) {
      record.status = 'Half Day';
    }

    await record.save();
    const populated = await Attendance.findById(record._id).populate('user', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Clock-out successful (IST)',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance analytics & summary for HR/Managers
// @route   GET /api/attendance/summary
// @access  Private (HR, Manager)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const todayIST = getISTDateString();

    const todayRecords = await Attendance.find({ date: todayIST }).populate('user', 'name email department');
    const presentCount = todayRecords.filter((r) => r.status === 'Present').length;
    const halfDayCount = todayRecords.filter((r) => r.status === 'Half Day').length;

    res.status(200).json({
      success: true,
      data: {
        dateIST: todayIST,
        totalCheckedInToday: todayRecords.length,
        present: presentCount,
        halfDay: halfDayCount,
        records: todayRecords,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

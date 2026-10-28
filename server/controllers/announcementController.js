const Announcement = require('../models/Announcement');

// @desc    Get announcements filtered for user's audience
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role;
    let audienceFilter = ['All'];

    if (userRole === 'Employee') {
      audienceFilter.push('Employees');
    } else if (userRole === 'Manager') {
      audienceFilter.push('Managers', 'Employees');
    } else if (userRole === 'HR') {
      audienceFilter.push('Managers', 'Employees');
    }

    const announcements = await Announcement.find({
      targetAudience: { $in: audienceFilter },
    })
      .populate('createdBy', 'name role email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new announcement (HR, Manager)
// @route   POST /api/announcements
// @access  Private (HR, Manager)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetAudience, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Please provide title and message content' });
    }

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user._id,
      targetAudience: targetAudience || 'All',
      priority: priority || 'Normal',
    });

    const populated = await Announcement.findById(announcement._id).populate('createdBy', 'name role email');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete announcement (HR only)
// @route   DELETE /api/announcements/:id
// @access  Private (HR)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

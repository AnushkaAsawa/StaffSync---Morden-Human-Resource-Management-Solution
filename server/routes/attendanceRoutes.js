const express = require('express');
const router = express.Router();
const {
  getAttendance,
  checkIn,
  checkOut,
  getAttendanceSummary,
} = require('../controllers/attendanceController');
const { protect, checkRole } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAttendance);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/summary', checkRole('HR', 'Manager'), getAttendanceSummary);

module.exports = router;

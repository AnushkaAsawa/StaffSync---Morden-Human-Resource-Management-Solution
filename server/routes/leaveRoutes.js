const express = require('express');
const router = express.Router();
const {
  getLeaves,
  applyLeave,
  updateLeaveStatus,
} = require('../controllers/leaveController');
const { protect, checkRole } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getLeaves)
  .post(applyLeave);

router.put('/:id/status', checkRole('HR', 'Manager'), updateLeaveStatus);

module.exports = router;

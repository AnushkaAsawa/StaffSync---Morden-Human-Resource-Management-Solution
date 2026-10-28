const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, checkRole } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getAnnouncements)
  .post(checkRole('HR', 'Manager'), createAnnouncement);

router.delete('/:id', checkRole('HR'), deleteAnnouncement);

module.exports = router;

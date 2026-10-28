const express = require('express');
const router = express.Router();
const {
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
} = require('../controllers/trainingController');
const { protect, checkRole } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getTrainings)
  .post(checkRole('HR', 'Manager'), createTraining);

router
  .route('/:id')
  .put(checkRole('HR', 'Manager'), updateTraining)
  .delete(checkRole('HR', 'Manager'), deleteTraining);

module.exports = router;

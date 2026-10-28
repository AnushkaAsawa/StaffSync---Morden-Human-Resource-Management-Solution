const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, checkRole } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getEmployees)
  .post(checkRole('HR'), createEmployee);

router
  .route('/:id')
  .get(getEmployeeById)
  .put(checkRole('HR'), updateEmployee)
  .delete(checkRole('HR'), deleteEmployee);

module.exports = router;

const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get all employees with search & filtering
// @route   GET /api/employees
// @access  Private (HR, Manager, Employee)
exports.getEmployees = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new employee (HR only)
// @route   POST /api/employees
// @access  Private (HR)
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary, joinDate, phone, address } = req.body;

    // Check if employee with email already exists
    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email: email.toLowerCase(),
      department,
      position,
      salary: Number(salary),
      joinDate: joinDate || new Date(),
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update employee (HR only)
// @route   PUT /api/employees/:id
// @access  Private (HR)
exports.updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee (HR only)
// @route   DELETE /api/employees/:id
// @access  Private (HR)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await employee.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Employee record successfully removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

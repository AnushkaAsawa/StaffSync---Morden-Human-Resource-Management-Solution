const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  name: {
    type: String,
    required: [true, 'Please provide an employee name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide employee corporate email'],
    lowercase: true,
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Please specify department'],
    enum: ['Engineering', 'Human Resources', 'Sales & Marketing', 'Operations', 'Finance', 'Design'],
  },
  position: {
    type: String,
    required: [true, 'Please specify position/designation'],
  },
  salary: {
    type: Number,
    required: [true, 'Please specify annual salary in INR (₹)'],
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    validate: {
      validator: function (v) {
        return /^(?:\+91|91)?[6789]\d{9}$/.test(v.replace(/[\s-]/g, ''));
      },
      message: (props) => `${props.value} is not a valid Indian (+91) phone number!`,
    },
  },
  address: {
    type: String,
    default: 'Bengaluru, Karnataka, India',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Employee', employeeSchema);

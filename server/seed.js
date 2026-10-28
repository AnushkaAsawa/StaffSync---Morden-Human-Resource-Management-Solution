/**
 * StaffSync - Database Seeding Script
 * Populates Demo Users, Employees, Attendance, Leaves, Announcements, and Trainings
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');
const Leave = require('./models/Leave');
const Attendance = require('./models/Attendance');
const Announcement = require('./models/Announcement');
const Training = require('./models/Training');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/staffsync';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Leave.deleteMany({});
    await Attendance.deleteMany({});
    await Announcement.deleteMany({});
    await Training.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Core Users (Pre-save hook will hash passwords)
    const hrUser = await User.create({
      name: 'Aditi Sharma',
      email: 'hr@staffsync.com',
      password: 'password123',
      role: 'HR',
      department: 'Human Resources',
    });

    const managerUser = await User.create({
      name: 'Vikram Malhotra',
      email: 'manager@staffsync.com',
      password: 'password123',
      role: 'Manager',
      department: 'Engineering',
    });

    const employeeUser = await User.create({
      name: 'Rahul Verma',
      email: 'employee@staffsync.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
    });

    const employeeUser2 = await User.create({
      name: 'Pooja Iyer',
      email: 'pooja.iyer@staffsync.com',
      password: 'password123',
      role: 'Employee',
      department: 'Design',
    });

    const employeeUser3 = await User.create({
      name: 'Ananya Deshmukh',
      email: 'ananya.d@staffsync.com',
      password: 'password123',
      role: 'Employee',
      department: 'Sales & Marketing',
    });

    console.log('[Seed] Created Demo Users: HR, Manager, Employees');

    // 2. Create Employee Directory Profiles (with INR ₹ Salaries & +91 Phone Numbers)
    const employees = await Employee.create([
      {
        user: employeeUser._id,
        name: 'Rahul Verma',
        email: 'employee@staffsync.com',
        department: 'Engineering',
        position: 'Senior Full-Stack Engineer',
        salary: 1650000, // ₹16,50,000 / annum
        joinDate: new Date('2023-04-10'),
        phone: '+919876543210',
        address: 'Indiranagar, Bengaluru, Karnataka 560038',
      },
      {
        user: managerUser._id,
        name: 'Vikram Malhotra',
        email: 'manager@staffsync.com',
        department: 'Engineering',
        position: 'Engineering Director',
        salary: 2800000, // ₹28,00,000 / annum
        joinDate: new Date('2021-02-15'),
        phone: '+919811223344',
        address: 'HSR Layout Sector 2, Bengaluru, Karnataka 560102',
      },
      {
        user: hrUser._id,
        name: 'Aditi Sharma',
        email: 'hr@staffsync.com',
        department: 'Human Resources',
        position: 'Head of People Operations',
        salary: 2200000, // ₹22,00,000 / annum
        joinDate: new Date('2022-01-10'),
        phone: '+919822334455',
        address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034',
      },
      {
        user: employeeUser2._id,
        name: 'Pooja Iyer',
        email: 'pooja.iyer@staffsync.com',
        department: 'Design',
        position: 'Lead Product Designer',
        salary: 1550000, // ₹15,50,000 / annum
        joinDate: new Date('2023-08-01'),
        phone: '+919833445566',
        address: 'Whitefield, Bengaluru, Karnataka 560066',
      },
      {
        user: employeeUser3._id,
        name: 'Ananya Deshmukh',
        email: 'ananya.d@staffsync.com',
        department: 'Sales & Marketing',
        position: 'Growth Marketing Specialist',
        salary: 1250000, // ₹12,50,000 / annum
        joinDate: new Date('2024-01-15'),
        phone: '+919844556677',
        address: 'Jayanagar 4th T Block, Bengaluru, Karnataka 560041',
      },
    ]);
    console.log(`[Seed] Seeded ${employees.length} Employee Directory records.`);

    // 3. Create Sample Leave Applications
    await Leave.create([
      {
        user: employeeUser._id,
        leaveType: 'Privilege Leave',
        startDate: new Date('2026-11-05'),
        endDate: new Date('2026-11-08'),
        reason: 'Attending sibling wedding in Jaipur.',
        status: 'Pending',
        approverRole: 'Manager',
      },
      {
        user: employeeUser._id,
        leaveType: 'Sick Leave',
        startDate: new Date('2026-10-12'),
        endDate: new Date('2026-10-13'),
        reason: 'Seasonal viral fever and medical rest.',
        status: 'Approved',
        approverRole: 'Manager',
        approverRemarks: 'Approved. Get well soon!',
      },
      {
        user: employeeUser2._id,
        leaveType: 'Casual Leave',
        startDate: new Date('2026-11-14'),
        endDate: new Date('2026-11-15'),
        reason: 'Personal relocation and apartment shift.',
        status: 'Pending',
        approverRole: 'HR',
      },
    ]);
    console.log('[Seed] Seeded Leave Applications.');

    // 4. Create Attendance Logs (IST dates)
    const today = new Date().toISOString().split('T')[0];
    await Attendance.create([
      {
        user: employeeUser._id,
        date: today,
        checkInTime: new Date(Date.now() - 4 * 3600 * 1000), // 4 hours ago
        status: 'Present',
        totalHours: 4,
      },
      {
        user: managerUser._id,
        date: today,
        checkInTime: new Date(Date.now() - 6 * 3600 * 1000),
        status: 'Present',
        totalHours: 6,
      },
      {
        user: hrUser._id,
        date: today,
        checkInTime: new Date(Date.now() - 5 * 3600 * 1000),
        status: 'Present',
        totalHours: 5,
      },
    ]);
    console.log('[Seed] Seeded Today IST Attendance Records.');

    // 5. Create Company Announcements
    await Announcement.create([
      {
        title: 'Q4 All-Hands Townhall & Annual Strategy Session',
        message: 'Join us this Friday at 3:30 PM IST in the Auditorium and via Google Meet for our global roadmap announcement, employee awards, and company growth highlights.',
        createdBy: hrUser._id,
        targetAudience: 'All',
        priority: 'High',
      },
      {
        title: 'Revised Health Insurance & Wellness Policy 2026-27',
        message: 'HR has upgraded parental health coverage to ₹10,00,000 floater policy with OPD claims enabled. Check your corporate portal for enrollment forms before November 15th.',
        createdBy: hrUser._id,
        targetAudience: 'Employees',
        priority: 'Normal',
      },
      {
        title: 'Quarterly Performance Appraisal Cycle Kick-Off',
        message: 'All Department Managers are requested to complete 360-degree review evaluations for direct reports on StaffSync by the coming Tuesday.',
        createdBy: hrUser._id,
        targetAudience: 'Managers',
        priority: 'Urgent',
      },
    ]);
    console.log('[Seed] Seeded Company Announcements.');

    // 6. Create Training Programs
    await Training.create([
      {
        title: 'Cloud Architecture & Microservices on Kubernetes',
        description: 'Advanced hands-on workshop on container orchestration, service mesh routing, zero-downtime rolling deploys, and automated canary rollouts.',
        date: new Date('2026-11-10T14:00:00.000Z'),
        durationHours: 3,
        trainer: 'Kavita Sundaram (Cloud Architect Lead)',
        createdBy: managerUser._id,
        assignedTo: [employeeUser._id, employeeUser2._id],
        status: 'Scheduled',
      },
      {
        title: 'Modern UI Engineering with Tailwind & Accessibility (WCAG 2.2)',
        description: 'Deep dive into high-performance web accessibility, keyboard focus trapping, high-contrast dark modes, and zero-pill typographic discipline.',
        date: new Date('2026-11-18T10:30:00.000Z'),
        durationHours: 2,
        trainer: 'Arjun Menon (Principal Frontend Architect)',
        createdBy: managerUser._id,
        assignedTo: [employeeUser._id, employeeUser2._id, employeeUser3._id],
        status: 'Scheduled',
      },
      {
        title: 'Leadership & Inclusive People Management',
        description: 'Effective cross-functional collaboration, performance coaching frameworks, and bias-free appraisal standards.',
        date: new Date('2026-11-25T11:00:00.000Z'),
        durationHours: 4,
        trainer: 'Dr. Meera Nambiar (Organizational Psychologist)',
        createdBy: hrUser._id,
        assignedTo: [managerUser._id],
        status: 'Scheduled',
      },
    ]);
    console.log('[Seed] Seeded Training Programs.');

    console.log('----------------------------------------------------');
    console.log('✅ StaffSync Database Seeding Completed Successfully!');
    console.log('Demo Credentials:');
    console.log('  HR:       hr@staffsync.com / password123');
    console.log('  Manager:  manager@staffsync.com / password123');
    console.log('  Employee: employee@staffsync.com / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();

import {
  User,
  Employee,
  Leave,
  Attendance,
  Announcement,
  Training,
} from '../types';
import { getTodayISTString } from '../utils/formatters';

// Keys for LocalStorage
const KEYS = {
  CURRENT_USER: 'staffsync_current_user',
  LOGGED_OUT: 'staffsync_logged_out',
  USERS: 'staffsync_users_data',
  EMPLOYEES: 'staffsync_employees_data',
  LEAVES: 'staffsync_leaves_data',
  ATTENDANCE: 'staffsync_attendance_data',
  ANNOUNCEMENTS: 'staffsync_announcements_data',
  TRAININGS: 'staffsync_trainings_data',
};

// Seed Users
const DEFAULT_USERS: User[] = [
  {
    _id: 'usr_hr_01',
    name: 'Aditi Sharma',
    email: 'hr@staffsync.com',
    role: 'HR',
    department: 'Human Resources',
    createdAt: '2023-01-15T09:00:00.000Z',
  },
  {
    _id: 'usr_mgr_01',
    name: 'Vikram Malhotra',
    email: 'manager@staffsync.com',
    role: 'Manager',
    department: 'Engineering',
    createdAt: '2023-02-01T09:00:00.000Z',
  },
  {
    _id: 'usr_emp_01',
    name: 'Rahul Verma',
    email: 'employee@staffsync.com',
    role: 'Employee',
    department: 'Engineering',
    createdAt: '2023-04-10T09:00:00.000Z',
  },
  {
    _id: 'usr_emp_02',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@staffsync.com',
    role: 'Employee',
    department: 'Design',
    createdAt: '2023-08-01T09:00:00.000Z',
  },
  {
    _id: 'usr_emp_03',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@staffsync.com',
    role: 'Employee',
    department: 'Sales & Marketing',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
];

// Seed Employees
const DEFAULT_EMPLOYEES: Employee[] = [
  {
    _id: 'emp_01',
    user: 'usr_emp_01',
    name: 'Rahul Verma',
    email: 'employee@staffsync.com',
    department: 'Engineering',
    position: 'Senior Full-Stack Engineer',
    salary: 1650000, // ₹16,50,000 / annum
    joinDate: '2023-04-10',
    phone: '+919876543210',
    address: 'Indiranagar, Bengaluru, Karnataka 560038',
    createdAt: '2023-04-10T09:00:00.000Z',
  },
  {
    _id: 'emp_02',
    user: 'usr_mgr_01',
    name: 'Vikram Malhotra',
    email: 'manager@staffsync.com',
    department: 'Engineering',
    position: 'Engineering Director',
    salary: 2800000, // ₹28,00,000 / annum
    joinDate: '2021-02-15',
    phone: '+919811223344',
    address: 'HSR Layout Sector 2, Bengaluru, Karnataka 560102',
    createdAt: '2021-02-15T09:00:00.000Z',
  },
  {
    _id: 'emp_03',
    user: 'usr_hr_01',
    name: 'Aditi Sharma',
    email: 'hr@staffsync.com',
    department: 'Human Resources',
    position: 'Head of People Operations',
    salary: 2200000, // ₹22,00,000 / annum
    joinDate: '2022-01-10',
    phone: '+919822334455',
    address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034',
    createdAt: '2022-01-10T09:00:00.000Z',
  },
  {
    _id: 'emp_04',
    user: 'usr_emp_02',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@staffsync.com',
    department: 'Design',
    position: 'Lead Product Designer',
    salary: 1550000, // ₹15,50,000 / annum
    joinDate: '2023-08-01',
    phone: '+919833445566',
    address: 'Whitefield, Bengaluru, Karnataka 560066',
    createdAt: '2023-08-01T09:00:00.000Z',
  },
  {
    _id: 'emp_05',
    user: 'usr_emp_03',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@staffsync.com',
    department: 'Sales & Marketing',
    position: 'Growth Marketing Specialist',
    salary: 1250000, // ₹12,50,000 / annum
    joinDate: '2024-01-15',
    phone: '+919844556677',
    address: 'Jayanagar 4th T Block, Bengaluru, Karnataka 560041',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
];

// Seed Leaves
const DEFAULT_LEAVES: Leave[] = [
  {
    _id: 'leave_01',
    user: {
      _id: 'usr_emp_01',
      name: 'Rahul Verma',
      email: 'employee@staffsync.com',
      department: 'Engineering',
      role: 'Employee',
    },
    leaveType: 'Privilege Leave',
    startDate: '2026-11-05',
    endDate: '2026-11-08',
    reason: 'Family wedding celebrations in Jaipur, Rajasthan.',
    status: 'Pending',
    approverRole: 'Manager',
    createdAt: '2026-10-25T11:20:00.000Z',
  },
  {
    _id: 'leave_02',
    user: {
      _id: 'usr_emp_01',
      name: 'Rahul Verma',
      email: 'employee@staffsync.com',
      department: 'Engineering',
      role: 'Employee',
    },
    leaveType: 'Sick Leave',
    startDate: '2026-10-12',
    endDate: '2026-10-13',
    reason: 'Seasonal viral fever and medical recovery.',
    status: 'Approved',
    approverRole: 'Manager',
    approverRemarks: 'Approved by Vikram. Take adequate rest!',
    createdAt: '2026-10-11T16:00:00.000Z',
  },
  {
    _id: 'leave_03',
    user: {
      _id: 'usr_emp_02',
      name: 'Pooja Iyer',
      email: 'pooja.iyer@staffsync.com',
      department: 'Design',
      role: 'Employee',
    },
    leaveType: 'Casual Leave',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    reason: 'Apartment shifting and personal relocation.',
    status: 'Pending',
    approverRole: 'HR',
    createdAt: '2026-10-26T08:30:00.000Z',
  },
  {
    _id: 'leave_04',
    user: {
      _id: 'usr_emp_03',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@staffsync.com',
      department: 'Sales & Marketing',
      role: 'Employee',
    },
    leaveType: 'Casual Leave',
    startDate: '2026-10-02',
    endDate: '2026-10-03',
    reason: 'Long weekend family trip to Coorg.',
    status: 'Approved',
    approverRole: 'HR',
    approverRemarks: 'Approved for Gandhi Jayanti extension.',
    createdAt: '2026-09-28T14:15:00.000Z',
  },
];

// Seed Announcements
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    _id: 'ann_01',
    title: 'Q4 All-Hands Townhall & Annual Engineering Keynote',
    message: 'Join leadership this Friday at 3:30 PM IST in the Auditorium and streaming on Google Meet for roadmap releases, excellence awards, and product milestones.',
    createdBy: {
      _id: 'usr_hr_01',
      name: 'Aditi Sharma',
      role: 'HR',
    },
    targetAudience: 'All',
    priority: 'High',
    createdAt: '2026-10-26T09:00:00.000Z',
  },
  {
    _id: 'ann_02',
    title: 'Upgraded Corporate Medical Coverage: ₹10,00,000 Floater Policy',
    message: 'StaffSync HR has partnered with Care Health to enhance inpatient and OPD benefits. Review dependent enrollment forms before November 15th.',
    createdBy: {
      _id: 'usr_hr_01',
      name: 'Aditi Sharma',
      role: 'HR',
    },
    targetAudience: 'Employees',
    priority: 'Normal',
    createdAt: '2026-10-24T12:00:00.000Z',
  },
  {
    _id: 'ann_03',
    title: 'Bi-Annual Performance Appraisal Cycles Initiated',
    message: 'All Department Managers are requested to submit 360-degree review evaluations for direct reports on StaffSync by Tuesday evening.',
    createdBy: {
      _id: 'usr_hr_01',
      name: 'Aditi Sharma',
      role: 'HR',
    },
    targetAudience: 'Managers',
    priority: 'Urgent',
    createdAt: '2026-10-23T15:45:00.000Z',
  },
];

// Seed Trainings
const DEFAULT_TRAININGS: Training[] = [
  {
    _id: 'trn_01',
    title: 'Cloud Architecture & Microservices on Kubernetes',
    description: 'Comprehensive workshop on container orchestration, service mesh routing, zero-downtime rolling deploys, and automated canary rollouts.',
    date: '2026-11-10T14:00:00.000Z',
    durationHours: 3,
    trainer: 'Kavita Sundaram (Cloud Architect Lead)',
    createdBy: {
      _id: 'usr_mgr_01',
      name: 'Vikram Malhotra',
      role: 'Manager',
    },
    assignedTo: [
      {
        _id: 'usr_emp_01',
        name: 'Rahul Verma',
        email: 'employee@staffsync.com',
        department: 'Engineering',
      },
      {
        _id: 'usr_emp_02',
        name: 'Pooja Iyer',
        email: 'pooja.iyer@staffsync.com',
        department: 'Design',
      },
    ],
    status: 'Scheduled',
    createdAt: '2026-10-20T10:00:00.000Z',
  },
  {
    _id: 'trn_02',
    title: 'Modern UI Engineering with Tailwind CSS & WCAG 2.2 Standards',
    description: 'Hands-on training covering keyboard navigation compliance, zero-pill aesthetic discipline, high contrast accessibility, and sub-200ms interaction latency.',
    date: '2026-11-18T10:30:00.000Z',
    durationHours: 2,
    trainer: 'Arjun Menon (Principal Frontend Architect)',
    createdBy: {
      _id: 'usr_mgr_01',
      name: 'Vikram Malhotra',
      role: 'Manager',
    },
    assignedTo: [
      {
        _id: 'usr_emp_01',
        name: 'Rahul Verma',
        email: 'employee@staffsync.com',
        department: 'Engineering',
      },
      {
        _id: 'usr_emp_02',
        name: 'Pooja Iyer',
        email: 'pooja.iyer@staffsync.com',
        department: 'Design',
      },
      {
        _id: 'usr_emp_03',
        name: 'Ananya Deshmukh',
        email: 'ananya.d@staffsync.com',
        department: 'Sales & Marketing',
      },
    ],
    status: 'Scheduled',
    createdAt: '2026-10-22T14:30:00.000Z',
  },
  {
    _id: 'trn_03',
    title: 'Executive Leadership & Empathetic People Management',
    description: 'Frameworks for asynchronous 1-on-1 feedback, empathetic delegation, burnout detection, and high-performance cross-functional alignment.',
    date: '2026-11-25T11:00:00.000Z',
    durationHours: 4,
    trainer: 'Dr. Meera Nambiar (Organizational Psychologist)',
    createdBy: {
      _id: 'usr_hr_01',
      name: 'Aditi Sharma',
      role: 'HR',
    },
    assignedTo: [
      {
        _id: 'usr_mgr_01',
        name: 'Vikram Malhotra',
        email: 'manager@staffsync.com',
        department: 'Engineering',
      },
    ],
    status: 'Scheduled',
    createdAt: '2026-10-18T09:00:00.000Z',
  },
];

// Helper to initialize local storage
const initStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  // Only auto-initialize current user if user has not explicitly logged out
  if (!localStorage.getItem(KEYS.CURRENT_USER) && !localStorage.getItem(KEYS.LOGGED_OUT)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
  }
  if (!localStorage.getItem(KEYS.EMPLOYEES)) {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
  }
  if (!localStorage.getItem(KEYS.LEAVES)) {
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(DEFAULT_LEAVES));
  }
  if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(KEYS.TRAININGS)) {
    localStorage.setItem(KEYS.TRAININGS, JSON.stringify(DEFAULT_TRAININGS));
  }
  if (!localStorage.getItem(KEYS.ATTENDANCE)) {
    const today = getTodayISTString();
    const defaultAttendance: Attendance[] = [
      {
        _id: 'att_01',
        user: {
          _id: 'usr_emp_01',
          name: 'Rahul Verma',
          email: 'employee@staffsync.com',
          department: 'Engineering',
        },
        date: today,
        checkInTime: new Date(Date.now() - 5.5 * 3600 * 1000).toISOString(),
        totalHours: 5.5,
        status: 'Present',
        notes: 'In-office biometric & portal check-in',
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'att_02',
        user: {
          _id: 'usr_mgr_01',
          name: 'Vikram Malhotra',
          email: 'manager@staffsync.com',
          department: 'Engineering',
        },
        date: today,
        checkInTime: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        totalHours: 6.0,
        status: 'Present',
        notes: 'Standard morning shift',
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'att_03',
        user: {
          _id: 'usr_hr_01',
          name: 'Aditi Sharma',
          email: 'hr@staffsync.com',
          department: 'Human Resources',
        },
        date: today,
        checkInTime: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
        totalHours: 4.5,
        status: 'Present',
        notes: 'HR Ops',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(defaultAttendance));
  }
};

initStorage();

export const StorageService = {
  // Current User & Auth
  getCurrentUser: (): User | null => {
    initStorage();
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    if (!u || u === 'null') return null;
    try {
      return JSON.parse(u);
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User | null): void => {
    if (!user) {
      localStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.setItem(KEYS.LOGGED_OUT, 'true');
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.removeItem(KEYS.LOGGED_OUT);
    }
  },

  login: (email: string, _password?: string): User | null => {
    const users = StorageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      StorageService.setCurrentUser(found);
      return found;
    }
    // If not found in custom list, check default demo users
    const defaultFound = DEFAULT_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (defaultFound) {
      StorageService.setCurrentUser(defaultFound);
      return defaultFound;
    }
    return null;
  },

  logout: (): void => {
    StorageService.setCurrentUser(null);
  },

  register: (data: { name: string; email: string; role: 'HR' | 'Manager' | 'Employee'; department: string }): User => {
    const users = StorageService.getUsers();
    const newUser: User = {
      _id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      department: data.department || 'General',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    StorageService.setCurrentUser(newUser);
    return newUser;
  },

  getUsers: (): User[] => {
    initStorage();
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  },

  switchUserByRole: (role: 'HR' | 'Manager' | 'Employee'): User => {
    const users = StorageService.getUsers();
    const target = users.find((u) => u.role === role) || DEFAULT_USERS.find((u) => u.role === role)!;
    StorageService.setCurrentUser(target);
    return target;
  },

  // Employees CRUD
  getEmployees: (): Employee[] => {
    initStorage();
    const data = localStorage.getItem(KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : DEFAULT_EMPLOYEES;
  },

  saveEmployee: (emp: Omit<Employee, '_id' | 'createdAt'> & { _id?: string }): Employee => {
    const list = StorageService.getEmployees();
    if (emp._id) {
      // Update
      const index = list.findIndex((e) => e._id === emp._id);
      if (index !== -1) {
        list[index] = { ...list[index], ...emp };
        localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(list));
        return list[index];
      }
    }
    // Create
    const newEmp: Employee = {
      ...emp,
      _id: `emp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEmp);
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(list));
    return newEmp;
  },

  deleteEmployee: (id: string): void => {
    const list = StorageService.getEmployees().filter((e) => e._id !== id);
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(list));
  },

  // Attendance
  getAttendance: (): Attendance[] => {
    initStorage();
    const data = localStorage.getItem(KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  getUserTodayAttendance: (userId: string): Attendance | undefined => {
    const list = StorageService.getAttendance();
    const today = getTodayISTString();
    return list.find((a) => a.user._id === userId && a.date === today);
  },

  clockIn: (user: User): Attendance => {
    const list = StorageService.getAttendance();
    const today = getTodayISTString();
    let record = list.find((a) => a.user._id === user._id && a.date === today);

    if (record && record.checkInTime) {
      return record;
    }

    const now = new Date().toISOString();
    if (!record) {
      record = {
        _id: `att_${Date.now()}`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
        },
        date: today,
        checkInTime: now,
        totalHours: 0,
        status: 'Present',
        notes: 'Punched in via StaffSync Web Portal',
        createdAt: now,
      };
      list.unshift(record);
    } else {
      record.checkInTime = now;
      record.status = 'Present';
    }

    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(list));
    return record;
  },

  clockOut: (userId: string): Attendance | null => {
    const list = StorageService.getAttendance();
    const today = getTodayISTString();
    const record = list.find((a) => a.user._id === userId && a.date === today);

    if (!record || !record.checkInTime) return null;

    const now = new Date();
    record.checkOutTime = now.toISOString();
    const checkInDate = new Date(record.checkInTime);
    const durationHours = (now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
    record.totalHours = parseFloat(durationHours.toFixed(2));

    if (record.totalHours < 4) {
      record.status = 'Half Day';
    } else {
      record.status = 'Present';
    }

    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(list));
    return record;
  },

  // Leaves
  getLeaves: (): Leave[] => {
    initStorage();
    const data = localStorage.getItem(KEYS.LEAVES);
    return data ? JSON.parse(data) : DEFAULT_LEAVES;
  },

  applyLeave: (
    user: User,
    data: { leaveType: Leave['leaveType']; startDate: string; endDate: string; reason: string }
  ): Leave => {
    const list = StorageService.getLeaves();
    const newLeave: Leave = {
      _id: `leave_${Date.now()}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'Pending',
      approverRole: user.role === 'Manager' ? 'HR' : 'Manager',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newLeave);
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(list));
    return newLeave;
  },

  updateLeaveStatus: (
    leaveId: string,
    status: Leave['status'],
    approverRole: 'HR' | 'Manager',
    remarks?: string
  ): Leave | null => {
    const list = StorageService.getLeaves();
    const index = list.findIndex((l) => l._id === leaveId);
    if (index === -1) return null;

    list[index].status = status;
    list[index].approverRole = approverRole;
    if (remarks) {
      list[index].approverRemarks = remarks;
    }
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(list));
    return list[index];
  },

  // Announcements
  getAnnouncements: (): Announcement[] => {
    initStorage();
    const data = localStorage.getItem(KEYS.ANNOUNCEMENTS);
    return data ? JSON.parse(data) : DEFAULT_ANNOUNCEMENTS;
  },

  createAnnouncement: (
    user: User,
    ann: { title: string; message: string; targetAudience: Announcement['targetAudience']; priority: Announcement['priority'] }
  ): Announcement => {
    const list = StorageService.getAnnouncements();
    const newAnn: Announcement = {
      _id: `ann_${Date.now()}`,
      title: ann.title,
      message: ann.message,
      targetAudience: ann.targetAudience,
      priority: ann.priority,
      createdBy: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
      createdAt: new Date().toISOString(),
    };
    list.unshift(newAnn);
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    return newAnn;
  },

  deleteAnnouncement: (id: string): void => {
    const list = StorageService.getAnnouncements().filter((a) => a._id !== id);
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(list));
  },

  // Trainings
  getTrainings: (): Training[] => {
    initStorage();
    const data = localStorage.getItem(KEYS.TRAININGS);
    return data ? JSON.parse(data) : DEFAULT_TRAININGS;
  },

  createTraining: (
    user: User,
    trn: {
      title: string;
      description: string;
      date: string;
      durationHours: number;
      trainer: string;
      assignedTo: Array<{ _id: string; name: string; email: string; department: string }>;
    }
  ): Training => {
    const list = StorageService.getTrainings();
    const newTraining: Training = {
      _id: `trn_${Date.now()}`,
      title: trn.title,
      description: trn.description,
      date: trn.date,
      durationHours: trn.durationHours,
      trainer: trn.trainer,
      createdBy: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
      assignedTo: trn.assignedTo,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newTraining);
    localStorage.setItem(KEYS.TRAININGS, JSON.stringify(list));
    return newTraining;
  },

  updateTrainingStatus: (id: string, status: Training['status']): Training | null => {
    const list = StorageService.getTrainings();
    const index = list.findIndex((t) => t._id === id);
    if (index === -1) return null;
    list[index].status = status;
    localStorage.setItem(KEYS.TRAININGS, JSON.stringify(list));
    return list[index];
  },

  deleteTraining: (id: string): void => {
    const list = StorageService.getTrainings().filter((t) => t._id !== id);
    localStorage.setItem(KEYS.TRAININGS, JSON.stringify(list));
  },

  // Reset to initial factory seed
  resetFactoryData: (): void => {
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.EMPLOYEES);
    localStorage.removeItem(KEYS.LEAVES);
    localStorage.removeItem(KEYS.ATTENDANCE);
    localStorage.removeItem(KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(KEYS.TRAININGS);
    initStorage();
  },
};

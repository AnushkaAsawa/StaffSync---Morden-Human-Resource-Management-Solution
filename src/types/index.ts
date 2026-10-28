export type UserRole = 'HR' | 'Employee' | 'Manager';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  createdAt: string;
}

export interface Employee {
  _id: string;
  user?: string;
  name: string;
  email: string;
  department: 'Engineering' | 'Human Resources' | 'Sales & Marketing' | 'Operations' | 'Finance' | 'Design';
  position: string;
  salary: number; // In INR (₹)
  joinDate: string;
  phone: string; // +91 format
  address: string;
  createdAt: string;
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Privilege Leave' | 'Maternity/Paternity';

export interface Leave {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    department: string;
    role?: UserRole;
  };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approverRole: 'HR' | 'Manager';
  approverRemarks?: string;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day';

export interface Attendance {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  date: string; // YYYY-MM-DD
  checkInTime?: string;
  checkOutTime?: string;
  totalHours: number;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
}

export type TargetAudience = 'All' | 'Employees' | 'Managers';
export type PriorityLevel = 'Normal' | 'High' | 'Urgent';

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  createdBy: {
    _id: string;
    name: string;
    role: string;
  };
  targetAudience: TargetAudience;
  priority: PriorityLevel;
  createdAt: string;
}

export type TrainingStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Training {
  _id: string;
  title: string;
  description: string;
  date: string;
  durationHours: number;
  trainer: string;
  createdBy: {
    _id: string;
    name: string;
    role: string;
  };
  assignedTo: Array<{
    _id: string;
    name: string;
    email: string;
    department: string;
  }>;
  status: TrainingStatus;
  createdAt: string;
}

import React from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { formatINR, formatDateIST, formatTimeIST } from '../utils/formatters';
import {
  Users,
  Clock,
  Calendar,
  GraduationCap,
  Bell,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Award,
} from 'lucide-react';

interface DashboardOverviewProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const employees = StorageService.getEmployees();
  const leaves = StorageService.getLeaves();
  const announcements = StorageService.getAnnouncements();
  const trainings = StorageService.getTrainings();
  const todayAttendance = StorageService.getUserTodayAttendance(currentUser._id);

  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;
  const isClockedIn = !!todayAttendance?.checkInTime;
  const isClockedOut = !!todayAttendance?.checkOutTime;

  const isHR = currentUser.role === 'HR';
  const isManager = currentUser.role === 'Manager';
  const isEmployee = currentUser.role === 'Employee';

  // Total payroll for HR
  const totalPayrollINR = employees.reduce((acc, curr) => acc + curr.salary, 0);

  // My assigned trainings for employee
  const myTrainings = trainings.filter(
    (t) =>
      t.assignedTo.some(
        (a) => a._id === currentUser._id || a.email === currentUser.email
      ) || t.assignedTo.length === 0
  );

  // Today's total attendance rate
  const attendanceLogs = StorageService.getAttendance();
  const todayLogs = attendanceLogs.filter(
    (a) => a.date === new Date().toISOString().split('T')[0]
  );
  const orgAttendanceRate = Math.round(
    (todayLogs.length / (employees.length || 1)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Executive Welcome Hero - White / Light Indigo Gradient */}
      <div className="rounded-lg border border-slate-200 bg-linear-to-r from-indigo-50/70 via-white to-slate-50 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <span>StaffSync HRM</span>
              <span>·</span>
              <span className="text-slate-600 font-mono">
                {isHR ? 'Executive HR Suite' : isManager ? 'Management Workspace' : 'Employee Self-Service'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Logged in as <span className="font-semibold text-indigo-700">{currentUser.role}</span> in{' '}
              <span className="font-semibold text-slate-900">{currentUser.department}</span>. All
              records are synchronized in real-time in Indian Standard Time (IST) and Indian Rupees (₹).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isEmployee && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('attendance')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Clock className="h-4 w-4" />
                  <span>{isClockedOut ? 'View Daily Punch' : isClockedIn ? 'Punch Out (IST)' : 'Punch In (IST)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('leaves')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-md transition-all border border-slate-300 shadow-2xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Apply for Leave</span>
                </button>
              </>
            )}

            {isManager && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('leaves')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Review Team Leaves ({pendingLeavesCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('trainings')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-md transition-all border border-slate-300 shadow-2xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <GraduationCap className="h-4 w-4 text-slate-500" />
                  <span>Schedule Training</span>
                </button>
              </>
            )}

            {isHR && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('employees')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Onboard Employee</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('leaves')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-md transition-all border border-slate-300 shadow-2xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Sanction Leaves</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Role-Specific Metric Cards */}
      {isEmployee && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('attendance')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Today's Punch Status</span>
              <Clock className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">
              {isClockedOut ? (
                <span className="text-emerald-600">Completed Shift</span>
              ) : isClockedIn ? (
                <span className="text-indigo-600">Clocked In</span>
              ) : (
                <span className="text-amber-600">Pending Check-in</span>
              )}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono">
              {todayAttendance?.checkInTime
                ? `Punch: ${formatTimeIST(todayAttendance.checkInTime)}`
                : 'Click to punch in IST'}
            </div>
          </div>

          <div
            onClick={() => onNavigate('leaves')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Available Leave Quota</span>
              <Calendar className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              27 <span className="text-xs font-normal text-slate-500">Days Total</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              8 Casual · 5 Sick · 14 Privilege
            </div>
          </div>

          <div
            onClick={() => onNavigate('trainings')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Assigned Trainings</span>
              <GraduationCap className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {myTrainings.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Upcoming cohorts & skill tracks →</div>
          </div>

          <div
            onClick={() => onNavigate('announcements')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Company Bulletins</span>
              <Bell className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {announcements.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">All-hands & policy releases →</div>
          </div>
        </div>
      )}

      {isManager && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('leaves')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pending Team Leaves</span>
              <Calendar className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-600">
              {pendingLeavesCount}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Requires sanctioning decision →</div>
          </div>

          <div
            onClick={() => onNavigate('trainings')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Trainings Scheduled</span>
              <GraduationCap className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {trainings.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Manage cohorts & trainees →</div>
          </div>

          <div
            onClick={() => onNavigate('attendance')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Team Attendance Log</span>
              <Clock className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {todayLogs.length} Checked In
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Today's active turnouts in IST →</div>
          </div>

          <div
            onClick={() => onNavigate('employees')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Team Roster</span>
              <Users className="h-4 w-4 text-slate-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {employees.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">View team contact directory →</div>
          </div>
        </div>
      )}

      {isHR && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('employees')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Headcount</span>
              <Users className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {employees.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Full Employee CRUD enabled →</div>
          </div>

          <div
            onClick={() => onNavigate('employees')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Annual Payroll CTC</span>
              <Award className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono tabular-nums text-emerald-700">
              {formatINR(totalPayrollINR)}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Calculated in INR (₹) →</div>
          </div>

          <div
            onClick={() => onNavigate('attendance')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Org Turnout (IST)</span>
              <Clock className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {orgAttendanceRate}%
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Biometric & web portal punches →</div>
          </div>

          <div
            onClick={() => onNavigate('leaves')}
            className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pending Approvals</span>
              <Calendar className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-600">
              {pendingLeavesCount}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Organization leave sanctioning →</div>
          </div>
        </div>
      )}

      {/* Two-Column Details Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements Strip */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600" />
              <span>Latest Company Broadcasts</span>
            </h2>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((a) => (
              <div key={a._id} className="p-3 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-900">{a.title}</span>
                  <span className="text-slate-500 font-mono">{formatDateIST(a.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{a.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Trainings Strip */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span>{isEmployee ? 'My Assigned Workshops' : 'Scheduled Training Programs'}</span>
            </h2>
            <button
              onClick={() => onNavigate('trainings')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {(isEmployee ? myTrainings : trainings).slice(0, 3).map((t) => (
              <div key={t._id} className="p-3 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-900">{t.title}</span>
                  <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">{t.status}</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-3 font-mono">
                  <span>{formatDateIST(t.date)}</span>
                  <span>·</span>
                  <span>Trainer: {t.trainer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

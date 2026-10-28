import React from 'react';
import { User, Attendance, Employee } from '../types';
import { StorageService } from '../services/storage';
import { formatDateIST, formatTimeIST, getTodayISTString } from '../utils/formatters';
import { BarChart3, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface AttendanceSummaryProps {
  currentUser: User;
}

export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ currentUser }) => {
  const attendanceLogs = StorageService.getAttendance();
  const employees = StorageService.getEmployees();
  const todayISTStr = getTodayISTString();

  const todayLogs = attendanceLogs.filter((a) => a.date === todayISTStr);
  const presentCount = todayLogs.filter((a) => a.status === 'Present').length;
  const halfDayCount = todayLogs.filter((a) => a.status === 'Half Day').length;
  const totalEmployees = employees.length || 1;
  const attendanceRate = Math.round((todayLogs.length / totalEmployees) * 100);

  // Group by department
  const deptStats = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { total: 0, present: 0 };
    }
    acc[emp.department].total += 1;
    const isPresent = todayLogs.some(
      (log) => log.user.email === emp.email || log.user.name === emp.name
    );
    if (isPresent) {
      acc[emp.department].present += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; present: number }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <span>Attendance Intelligence & Analytics</span>
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Real-time biometric & web portal punch synchronization across all divisions.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600">
          <span>Active Date (IST): </span>
          <span className="text-indigo-700 font-semibold">{todayISTStr}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Total Roster</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {totalEmployees}
          </div>
          <div className="mt-1 text-xs text-slate-500">Registered employees</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-emerald-600">Full Shift Present</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {presentCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">Punched in & verified</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-amber-600">Half Day Status</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-700">
            {halfDayCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">&lt; 4 hours logged</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-indigo-600">Attendance Rate</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-700">
            {attendanceRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">Today's active turnout</div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Departmental Turnout (IST)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(deptStats).map(([dept, data]) => {
            const pct = Math.round((data.present / (data.total || 1)) * 100);
            return (
              <div
                key={dept}
                className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{dept}</span>
                  <span className="font-mono text-slate-500">
                    {data.present}/{data.total}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>Attendance</span>
                  <span className="font-mono tabular-nums text-indigo-700 font-semibold">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Punch List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Today's Punch Logs</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Punch In (IST)</th>
                <th className="px-4 py-3">Punch Out (IST)</th>
                <th className="px-4 py-3 text-right">Logged Hours</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No punch records logged for today yet.
                  </td>
                </tr>
              ) : (
                todayLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{log.user?.name}</div>
                      <div className="text-[11px] text-slate-500">{log.user?.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{log.user?.department}</td>
                    <td className="px-4 py-3.5 font-mono tabular-nums text-slate-700">
                      {log.checkInTime ? formatTimeIST(log.checkInTime) : '—'}
                    </td>
                    <td className="px-4 py-3.5 font-mono tabular-nums text-slate-700">
                      {log.checkOutTime ? formatTimeIST(log.checkOutTime) : 'Shift In Progress'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-slate-900 font-semibold">
                      {log.totalHours ? `${log.totalHours} hrs` : 'Active'}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold ${
                          log.status === 'Present'
                            ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'
                            : log.status === 'Half Day'
                            ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded'
                            : 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

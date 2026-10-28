import React, { useState, useEffect } from 'react';
import { User, Attendance } from '../types';
import { StorageService } from '../services/storage';
import {
  formatDateIST,
  formatTimeIST,
  formatDateTimeIST,
  getTodayISTString,
} from '../utils/formatters';
import { Clock, CheckCircle, LogIn, LogOut, Calendar, AlertCircle } from 'lucide-react';

interface AttendanceTrackerProps {
  currentUser: User;
  onDataChange?: () => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  currentUser,
  onDataChange,
}) => {
  const [attendanceLogs, setAttendanceLogs] = useState<Attendance[]>([]);
  const [todayRecord, setTodayRecord] = useState<Attendance | undefined>();
  const [liveDuration, setLiveDuration] = useState<string>('0h 0m 0s');

  const refreshData = () => {
    const all = StorageService.getAttendance();
    const userLogs =
      currentUser.role === 'HR'
        ? all
        : all.filter((a) => a.user._id === currentUser._id || a.user.email === currentUser.email);
    setAttendanceLogs(userLogs);

    const todayRec = StorageService.getUserTodayAttendance(currentUser._id);
    setTodayRecord(todayRec);
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Live timer since check-in
  useEffect(() => {
    if (!todayRecord?.checkInTime || todayRecord?.checkOutTime) return;

    const timer = setInterval(() => {
      const checkInDate = new Date(todayRecord.checkInTime!);
      const now = new Date();
      const diffMs = now.getTime() - checkInDate.getTime();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setLiveDuration(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [todayRecord]);

  const handleClockIn = () => {
    StorageService.clockIn(currentUser);
    refreshData();
    if (onDataChange) onDataChange();
  };

  const handleClockOut = () => {
    StorageService.clockOut(currentUser._id);
    refreshData();
    if (onDataChange) onDataChange();
  };

  const todayISTStr = getTodayISTString();
  const isClockedIn = !!todayRecord?.checkInTime;
  const isClockedOut = !!todayRecord?.checkOutTime;

  return (
    <div className="space-y-6">
      {/* Attendance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <span>Attendance & IST Daily Punch Console</span>
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Standard working hours are tracked in Indian Standard Time (Asia/Kolkata UTC+5:30).
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600">
          <span>Date: </span>
          <span className="text-indigo-700 font-semibold">{todayISTStr}</span>
        </div>
      </div>

      {/* Clock In / Out Action Banner */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Attendance Status
            </div>
            <div className="text-xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
              {isClockedOut ? (
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle className="h-5 w-5" /> Clocked Out for the Day
                </span>
              ) : isClockedIn ? (
                <span className="text-indigo-600 flex items-center gap-1.5">
                  <Clock className="h-5 w-5 animate-pulse" /> Active Shift in Progress
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1.5">
                  <AlertCircle className="h-5 w-5" /> Not Clocked In Yet
                </span>
              )}
            </div>

            <div className="text-xs text-slate-600 font-mono flex flex-wrap gap-x-3 gap-y-1 pt-1 justify-center md:justify-start">
              {todayRecord?.checkInTime && (
                <span>In: {formatTimeIST(todayRecord.checkInTime)}</span>
              )}
              {todayRecord?.checkOutTime && (
                <span>Out: {formatTimeIST(todayRecord.checkOutTime)}</span>
              )}
              {isClockedIn && !isClockedOut && (
                <span className="text-indigo-700 font-medium">
                  Logged: {liveDuration}
                </span>
              )}
              {todayRecord?.totalHours ? (
                <span className="text-slate-900 font-medium">
                  Total: {todayRecord.totalHours} hrs ({todayRecord.status})
                </span>
              ) : null}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {!isClockedIn && (
              <button
                type="button"
                onClick={handleClockIn}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all shadow-xs active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                <span>Clock In (IST)</span>
              </button>
            )}

            {isClockedIn && !isClockedOut && (
              <button
                type="button"
                onClick={handleClockOut}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-all shadow-xs active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span>Clock Out (IST)</span>
              </button>
            )}

            {isClockedOut && (
              <div className="text-xs font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-md border border-slate-200">
                Punched out for today. See you tomorrow!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Log Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span>Attendance Log History</span>
          </h2>
          <span className="text-xs text-slate-500">
            Showing {attendanceLogs.length} entries
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date (DD/MM/YYYY)</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Punch In (IST)</th>
                <th className="px-4 py-3">Punch Out (IST)</th>
                <th className="px-4 py-3 text-right">Hours</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                attendanceLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-900 font-medium">
                      {formatDateIST(log.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{log.user?.name}</div>
                      <div className="text-[11px] text-slate-500">{log.user?.department}</div>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-700">
                      {log.checkInTime ? formatTimeIST(log.checkInTime) : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-700">
                      {log.checkOutTime ? formatTimeIST(log.checkOutTime) : 'Active / In Progress'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-900 font-medium">
                      {log.totalHours ? `${log.totalHours}h` : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
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

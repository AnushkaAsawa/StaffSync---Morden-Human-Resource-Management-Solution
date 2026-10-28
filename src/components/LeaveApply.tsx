import React, { useState } from 'react';
import { User, Leave, LeaveType } from '../types';
import { StorageService } from '../services/storage';
import { formatDateIST } from '../utils/formatters';
import { Calendar, PlusCircle, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';

interface LeaveApplyProps {
  currentUser: User;
  onDataChange?: () => void;
}

export const LeaveApply: React.FC<LeaveApplyProps> = ({ currentUser, onDataChange }) => {
  const [leaves, setLeaves] = useState<Leave[]>(() => {
    const all = StorageService.getLeaves();
    return all.filter((l) => l.user._id === currentUser._id || l.user.email === currentUser.email);
  });

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const leaveTypes: LeaveType[] = [
    'Casual Leave',
    'Sick Leave',
    'Privilege Leave',
    'Maternity/Paternity',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setFormError('Please select start and end dates and provide a detailed reason.');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError('End date cannot precede start date.');
      return;
    }

    StorageService.applyLeave(currentUser, formData);

    const updated = StorageService.getLeaves().filter(
      (l) => l.user._id === currentUser._id || l.user.email === currentUser.email
    );
    setLeaves(updated);
    setFormSuccess('Leave application submitted successfully for manager approval.');
    setFormData({
      leaveType: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    });

    if (onDataChange) onDataChange();
  };

  return (
    <div className="space-y-6">
      {/* Leave Balances Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Casual Leave (CL)</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            8 <span className="text-sm font-normal text-slate-500">/ 12 remaining</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">4 days utilized this fiscal year</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Sick Leave (SL)</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-700">
            5 <span className="text-sm font-normal text-slate-500">/ 7 remaining</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">2 days utilized</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Privilege Leave (PL)</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-800">
            14 <span className="text-sm font-normal text-slate-500">/ 18 remaining</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Carried forward eligible</div>
        </div>
      </div>

      {/* Leave Application Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <PlusCircle className="h-4 w-4 text-indigo-600" />
          <span>Apply for Leave</span>
        </h2>

        {formError && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Leave Category *
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value as LeaveType })
                }
                className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              >
                {leaveTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Start Date (DD/MM/YYYY) *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                End Date (DD/MM/YYYY) *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Reason / Justification *
            </label>
            <textarea
              required
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="State the purpose of your leave and emergency coverage contact..."
              className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>
      </div>

      {/* Personal Leave History */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-600" />
          <span>My Leave Applications & Status</span>
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Approver</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No leaves applied yet.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {leave.leaveType}
                    </td>
                    <td className="px-4 py-3.5 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {formatDateIST(leave.startDate)} → {formatDateIST(leave.endDate)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {leave.approverRole}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 italic max-w-xs truncate">
                      {leave.approverRemarks || 'Pending review'}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold ${
                          leave.status === 'Approved'
                            ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'
                            : leave.status === 'Rejected'
                            ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded'
                            : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded'
                        }`}
                      >
                        {leave.status}
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

import React, { useState } from 'react';
import { User, Leave, LeaveStatus } from '../types';
import { StorageService } from '../services/storage';
import { formatDateIST } from '../utils/formatters';
import { Calendar, Check, X, Filter, MessageSquare } from 'lucide-react';

interface LeaveApplicationsProps {
  currentUser: User;
  onDataChange?: () => void;
}

export const LeaveApplications: React.FC<LeaveApplicationsProps> = ({
  currentUser,
  onDataChange,
}) => {
  const [leaves, setLeaves] = useState<Leave[]>(() => StorageService.getLeaves());
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [remarkInput, setRemarkInput] = useState<{ [key: string]: string }>({});

  const isHR = currentUser.role === 'HR';
  const isManager = currentUser.role === 'Manager';

  const refreshLeaves = () => {
    const updated = StorageService.getLeaves();
    setLeaves(updated);
  };

  const handleStatusUpdate = (leaveId: string, newStatus: LeaveStatus) => {
    const remark = remarkInput[leaveId] || (newStatus === 'Approved' ? 'Approved' : 'Rejected');
    StorageService.updateLeaveStatus(
      leaveId,
      newStatus,
      currentUser.role as 'HR' | 'Manager',
      remark
    );
    refreshLeaves();
    if (onDataChange) onDataChange();
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchStatus = statusFilter === 'All' || leave.status === statusFilter;
    return matchStatus;
  });

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header and status breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <span>Leave Applications Review Console</span>
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            {isHR
              ? 'Organization-wide leave review with administrative approval rights.'
              : 'Review, approve, or reject team leave applications.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-md">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
              {status === 'Pending' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-amber-600">Pending Review</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {pendingCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">Awaiting leadership action</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-emerald-600">Approved Applications</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {approvedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">Sanctioned for upcoming dates</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-rose-600">Rejected Applications</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {rejectedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">Declined due to scheduling</div>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Duration (IST)</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Approver Notes</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No leave applications found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave) => {
                const canApprove = isHR || isManager;
                return (
                  <tr key={leave._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{leave.user?.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {leave.user?.department} · {leave.user?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                      {leave.leaveType}
                    </td>
                    <td className="px-4 py-3.5 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {formatDateIST(leave.startDate)} → {formatDateIST(leave.endDate)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 max-w-xs">
                      {leave.reason}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {leave.status === 'Pending' && canApprove ? (
                        <input
                          type="text"
                          placeholder="Optional remark..."
                          value={remarkInput[leave._id] || ''}
                          onChange={(e) =>
                            setRemarkInput({ ...remarkInput, [leave._id]: e.target.value })
                          }
                          className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-indigo-600 w-36 shadow-2xs"
                        />
                      ) : (
                        <span className="italic text-slate-500">{leave.approverRemarks || '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
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
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {canApprove && leave.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-xs"
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors shadow-xs"
                          >
                            <X className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {leave.approverRole ? `Handled by ${leave.approverRole}` : 'Resolved'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

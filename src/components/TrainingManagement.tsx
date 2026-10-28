import React, { useState } from 'react';
import { User, Training, Employee, TrainingStatus } from '../types';
import { StorageService } from '../services/storage';
import { formatDateTimeIST, formatDateIST } from '../utils/formatters';
import {
  GraduationCap,
  Calendar,
  Clock,
  User as UserIcon,
  Plus,
  Trash2,
  CheckCircle,
  Users,
  X,
} from 'lucide-react';

interface TrainingManagementProps {
  currentUser: User;
  onDataChange?: () => void;
}

export const TrainingManagement: React.FC<TrainingManagementProps> = ({
  currentUser,
  onDataChange,
}) => {
  const [trainings, setTrainings] = useState<Training[]>(() => {
    const all = StorageService.getTrainings();
    if (currentUser.role === 'Employee') {
      return all.filter(
        (t) =>
          t.assignedTo.some(
            (a) => a._id === currentUser._id || a.email === currentUser.email
          ) || t.assignedTo.length === 0
      );
    }
    return all;
  });

  const [employees] = useState<Employee[]>(() => StorageService.getEmployees());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    durationHours: 2,
    trainer: '',
    assignedUserIds: [] as string[],
  });

  const isManager = currentUser.role === 'Manager';
  const isHR = currentUser.role === 'HR';
  const canManage = isManager || isHR;

  const refreshTrainings = () => {
    const all = StorageService.getTrainings();
    if (currentUser.role === 'Employee') {
      setTrainings(
        all.filter(
          (t) =>
            t.assignedTo.some(
              (a) => a._id === currentUser._id || a.email === currentUser.email
            ) || t.assignedTo.length === 0
        )
      );
    } else {
      setTrainings(all);
    }
  };

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.trainer) return;

    const assignedObjects = employees
      .filter((emp) => formData.assignedUserIds.includes(emp._id) || formData.assignedUserIds.includes(emp.user || ''))
      .map((emp) => ({
        _id: emp.user || emp._id,
        name: emp.name,
        email: emp.email,
        department: emp.department,
      }));

    StorageService.createTraining(currentUser, {
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      durationHours: Number(formData.durationHours),
      trainer: formData.trainer,
      assignedTo: assignedObjects,
    });

    setFormData({
      title: '',
      description: '',
      date: '',
      durationHours: 2,
      trainer: '',
      assignedUserIds: [],
    });
    setIsModalOpen(false);
    refreshTrainings();
    if (onDataChange) onDataChange();
  };

  const handleStatusChange = (id: string, status: TrainingStatus) => {
    StorageService.updateTrainingStatus(id, status);
    refreshTrainings();
    if (onDataChange) onDataChange();
  };

  const handleDelete = (id: string) => {
    if (!canManage) return;
    if (window.confirm('Delete this training module?')) {
      StorageService.deleteTraining(id);
      refreshTrainings();
      if (onDataChange) onDataChange();
    }
  };

  const toggleEmployeeAssign = (id: string) => {
    if (formData.assignedUserIds.includes(id)) {
      setFormData({
        ...formData,
        assignedUserIds: formData.assignedUserIds.filter((x) => x !== id),
      });
    } else {
      setFormData({
        ...formData,
        assignedUserIds: [...formData.assignedUserIds, id],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <span>Upskilling & Training Management</span>
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            {canManage
              ? 'Schedule technical and leadership cohorts, assign team members, and track completion.'
              : 'Assigned skill workshops and certification tracks.'}
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Program</span>
          </button>
        )}
      </div>

      {/* Grid of Trainings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {trainings.length === 0 ? (
          <div className="col-span-2 rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 text-xs shadow-2xs">
            No active training cohorts scheduled at this time.
          </div>
        ) : (
          trainings.map((trn) => (
            <div
              key={trn._id}
              className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        trn.status === 'Completed'
                          ? 'text-emerald-700 bg-emerald-50'
                          : trn.status === 'In Progress'
                          ? 'text-indigo-700 bg-indigo-50'
                          : 'text-amber-700 bg-amber-50'
                      }`}
                    >
                      {trn.status}
                    </span>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">
                      {trn.title}
                    </h3>
                  </div>

                  {canManage && (
                    <button
                      type="button"
                      onClick={() => handleDelete(trn._id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete training"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {trn.description}
                </p>

                {/* Metadata */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{formatDateTimeIST(trn.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{trn.durationHours} Hours Duration</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <UserIcon className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Trainer: {trn.trainer}</span>
                  </div>
                </div>

                {/* Assigned employees */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>Assigned Enrollees ({trn.assignedTo.length})</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {trn.assignedTo.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">Open to all employees</span>
                    ) : (
                      trn.assignedTo.map((u) => (
                        <span
                          key={u._id}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {u.name} ({u.department})
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Status Action for Managers */}
              {canManage && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Update Phase:</span>
                  <div className="flex items-center gap-1">
                    {(['Scheduled', 'In Progress', 'Completed'] as TrainingStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(trn._id, st)}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                          trn.status === st
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Schedule Training Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Schedule Training Program
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTraining} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Database Sharding Workshop"
                  className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Lead Trainer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    placeholder="e.g. Priya Venkatesh (Principal Architect)"
                    className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Duration (Hours) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={formData.durationHours}
                    onChange={(e) =>
                      setFormData({ ...formData, durationHours: Number(e.target.value) })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700">
                  Session Date & Time (IST) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700">
                  Curriculum & Learning Goals *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline syllabus, prerequisites, and expected outcomes..."
                  className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Assign Team Members ({formData.assignedUserIds.length} selected)
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded bg-slate-50 border border-slate-200">
                  {employees.map((emp) => {
                    const isSelected =
                      formData.assignedUserIds.includes(emp._id) ||
                      formData.assignedUserIds.includes(emp.user || '');
                    return (
                      <div
                        key={emp._id}
                        onClick={() => toggleEmployeeAssign(emp._id)}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer text-xs ${
                          isSelected ? 'bg-indigo-100 text-indigo-900 font-medium' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-slate-900">{emp.name}</span>
                          <span className="ml-2 text-slate-500 text-[11px]">
                            ({emp.department} - {emp.position})
                          </span>
                        </div>
                        {isSelected && <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                >
                  Schedule Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

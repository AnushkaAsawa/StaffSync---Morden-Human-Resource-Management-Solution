import React, { useState } from 'react';
import { User, Announcement } from '../types';
import { StorageService } from '../services/storage';
import { formatDateIST } from '../utils/formatters';
import { Bell, Plus, Trash2, X } from 'lucide-react';

interface AnnouncementsBoardProps {
  currentUser: User;
  onDataChange?: () => void;
}

export const AnnouncementsBoard: React.FC<AnnouncementsBoardProps> = ({
  currentUser,
  onDataChange,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const all = StorageService.getAnnouncements();
    return all.filter((a) => {
      if (currentUser.role === 'HR') return true;
      if (a.targetAudience === 'All') return true;
      if (currentUser.role === 'Manager' && (a.targetAudience === 'Managers' || a.targetAudience === 'Employees')) return true;
      if (currentUser.role === 'Employee' && a.targetAudience === 'Employees') return true;
      return false;
    });
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newAudience, setNewAudience] = useState<Announcement['targetAudience']>('All');
  const [newPriority, setNewPriority] = useState<Announcement['priority']>('Normal');

  const isHR = currentUser.role === 'HR';
  const isManager = currentUser.role === 'Manager';
  const canPost = isHR || isManager;

  const refreshAnnouncements = () => {
    const all = StorageService.getAnnouncements();
    const filtered = all.filter((a) => {
      if (currentUser.role === 'HR') return true;
      if (a.targetAudience === 'All') return true;
      if (currentUser.role === 'Manager' && (a.targetAudience === 'Managers' || a.targetAudience === 'Employees')) return true;
      if (currentUser.role === 'Employee' && a.targetAudience === 'Employees') return true;
      return false;
    });
    setAnnouncements(filtered);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    StorageService.createAnnouncement(currentUser, {
      title: newTitle,
      message: newMessage,
      targetAudience: newAudience,
      priority: newPriority,
    });

    setNewTitle('');
    setNewMessage('');
    setIsModalOpen(false);
    refreshAnnouncements();
    if (onDataChange) onDataChange();
  };

  const handleDelete = (id: string) => {
    if (!isHR) return;
    if (window.confirm('Delete this announcement?')) {
      StorageService.deleteAnnouncement(id);
      refreshAnnouncements();
      if (onDataChange) onDataChange();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            <span>Company Announcements & Bulletins</span>
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Real-time organizational updates, policy releases, and all-hands townhalls.
          </p>
        </div>

        {canPost && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>New Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements List Cards */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 text-xs shadow-2xs">
            No announcements available for your department at this moment.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann._id}
              className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-xs transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        ann.priority === 'Urgent'
                          ? 'text-rose-700 bg-rose-50'
                          : ann.priority === 'High'
                          ? 'text-amber-700 bg-amber-50'
                          : 'text-indigo-700 bg-indigo-50'
                      }`}
                    >
                      {ann.priority} Priority
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      Audience: {ann.targetAudience}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">{ann.title}</h3>
                </div>

                {isHR && (
                  <button
                    type="button"
                    onClick={() => handleDelete(ann._id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors"
                    title="Delete announcement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {ann.message}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <div>
                  Published by <span className="text-slate-800 font-medium">{ann.createdBy.name}</span> ({ann.createdBy.role})
                </div>
                <div>{formatDateIST(ann.createdAt)} IST</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Broadcast Corporate Announcement
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Annual Strategy Townhall & Holiday Schedule"
                  className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Target Audience *
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) =>
                      setNewAudience(e.target.value as Announcement['targetAudience'])
                    }
                    className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  >
                    <option value="All">All Organization</option>
                    <option value="Employees">Employees Only</option>
                    <option value="Managers">Managers Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Priority Level *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(e.target.value as Announcement['priority'])
                    }
                    className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type the full announcement content, instructions, and dates..."
                  className="mt-1 w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                />
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
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

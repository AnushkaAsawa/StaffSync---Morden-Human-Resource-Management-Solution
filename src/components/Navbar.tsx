import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { formatTimeIST, formatDateIST } from '../utils/formatters';
import {
  Clock,
  LogOut,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  onOpenLogin,
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [istDate, setIstDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(formatTimeIST(now));
      setIstDate(formatDateIST(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute navigation links dynamically based on the active role
  const getNavLinks = () => {
    if (!currentUser) return [];

    if (currentUser.role === 'Employee') {
      return [
        { id: 'dashboard', label: 'My Overview' },
        { id: 'attendance', label: 'My Attendance' },
        { id: 'leaves', label: 'Apply Leave' },
        { id: 'trainings', label: 'My Trainings' },
        { id: 'announcements', label: 'Bulletins' },
        { id: 'employees', label: 'Directory' },
      ];
    }

    if (currentUser.role === 'Manager') {
      return [
        { id: 'dashboard', label: 'Manager Overview' },
        { id: 'leaves', label: 'Leave Approvals' },
        { id: 'trainings', label: 'Training Management' },
        { id: 'attendance', label: 'Team Attendance' },
        { id: 'announcements', label: 'Announcements' },
        { id: 'employees', label: 'Directory' },
      ];
    }

    // HR Role (Full Access)
    return [
      { id: 'dashboard', label: 'HR Executive Overview' },
      { id: 'employees', label: 'Employee CRUD' },
      { id: 'leaves', label: 'Organization Leaves' },
      { id: 'attendance', label: 'Attendance Analytics' },
      { id: 'announcements', label: 'Announcements Manager' },
      { id: 'trainings', label: 'Trainings' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top utility bar with IST Clock and Auth State */}
      <div className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-1.5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: IST Real-Time Clock */}
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-3.5 w-3.5 text-indigo-600" />
            <span className="font-medium text-slate-700">IST (UTC+5:30):</span>
            <span className="font-mono tabular-nums text-slate-900 font-semibold">{istTime}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono tabular-nums text-slate-600">{istDate}</span>
          </div>

          {/* Right: Active Account Status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">Active Account:</span>
              <span className="font-semibold text-slate-800">{currentUser.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Authentication Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-xs">
            SS
          </div>
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-left text-base font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            StaffSync
          </button>
        </div>

        {/* Role-Restricted Nav Links (Only when logged in) */}
        {currentUser ? (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onSelectTab(link.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:block text-xs text-slate-500">
            Please sign in to view role-restricted HRMS workflows
          </div>
        )}

        {/* User Profile Context & Logout / Login Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 whitespace-nowrap">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center justify-end gap-1.5">
                  <span
                    className={`font-semibold ${
                      currentUser.role === 'HR'
                        ? 'text-indigo-600'
                        : currentUser.role === 'Manager'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                  <span>·</span>
                  <span>{currentUser.department}</span>
                </div>
              </div>

              <div
                className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-semibold text-indigo-700 shrink-0"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                {currentUser.name.charAt(0)}
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors shadow-2xs"
                title="Logout from StaffSync"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav tab row (when logged in) */}
      {currentUser && (
        <div className="flex md:hidden overflow-x-auto border-t border-slate-200 px-4 py-2 gap-2 scrollbar-none bg-slate-50">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onSelectTab(link.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

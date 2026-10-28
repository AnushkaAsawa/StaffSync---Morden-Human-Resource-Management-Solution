import React, { useState } from 'react';
import { User } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { AuthPortal } from './components/AuthPortal';
import { DashboardOverview } from './components/DashboardOverview';
import { EmployeeCRUD } from './components/EmployeeCRUD';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AttendanceSummary } from './components/AttendanceSummary';
import { LeaveApply } from './components/LeaveApply';
import { LeaveApplications } from './components/LeaveApplications';
import { AnnouncementsBoard } from './components/AnnouncementsBoard';
import { TrainingManagement } from './components/TrainingManagement';
import { RotateCcw, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    StorageService.getCurrentUser()
  );
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [attendanceSubTab, setAttendanceSubTab] = useState<'punch' | 'summary'>('punch');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Login handler - sets active user & role
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    showNotification(`Welcome back, ${user.name}! Signed in as ${user.role}.`);
  };

  // Logout handler - clears session so user can log in as a different role/account
  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    showNotification('Logged out successfully. Please sign in to choose an account.');
  };

  // Reset to initial seed
  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default factory state?')) {
      StorageService.resetFactoryData();
      setCurrentUser(StorageService.getCurrentUser());
      setActiveTab('dashboard');
      window.location.reload();
    }
  };

  const isHR = currentUser?.role === 'HR';
  const isManager = currentUser?.role === 'Manager';
  const isEmployee = currentUser?.role === 'Employee';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-md bg-slate-900 text-white border border-slate-700 shadow-xl text-xs backdrop-blur-md animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar with IST clock, Role Tabs & Login/Logout buttons */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        onOpenLogin={() => {
          handleLogout();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* If user is logged out, render the Auth Portal */}
        {!currentUser ? (
          <AuthPortal onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {/* TAB: DASHBOARD / OVERVIEW */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                currentUser={currentUser}
                onNavigate={setActiveTab}
              />
            )}

            {/* TAB: ATTENDANCE (Role-Specific) */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                {/* For HR & Manager: provide toggle between personal punch and org-wide analytics */}
                {(isHR || isManager) ? (
                  <>
                    <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-200 rounded-md w-fit">
                      <button
                        type="button"
                        onClick={() => setAttendanceSubTab('punch')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                          attendanceSubTab === 'punch'
                            ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        My Daily Punch (IST)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceSubTab('summary')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                          attendanceSubTab === 'summary'
                            ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isHR ? 'Organization Attendance Analytics' : 'Team Turnout Analytics'}
                      </button>
                    </div>

                    {attendanceSubTab === 'summary' ? (
                      <AttendanceSummary currentUser={currentUser} />
                    ) : (
                      <AttendanceTracker currentUser={currentUser} />
                    )}
                  </>
                ) : (
                  /* Employee ONLY sees their personal daily punch & logs */
                  <AttendanceTracker currentUser={currentUser} />
                )}
              </div>
            )}

            {/* TAB: LEAVES (Role-Specific) */}
            {activeTab === 'leaves' && (
              <div className="space-y-4">
                {isEmployee ? (
                  /* Employee: Apply for leave & view personal application history */
                  <LeaveApply currentUser={currentUser} />
                ) : (
                  /* Manager & HR: Review and approve/reject leave applications */
                  <LeaveApplications currentUser={currentUser} />
                )}
              </div>
            )}

            {/* TAB: EMPLOYEES / DIRECTORY (Role-Specific CRUD vs Read-Only) */}
            {activeTab === 'employees' && (
              <EmployeeCRUD currentUser={currentUser} />
            )}

            {/* TAB: ANNOUNCEMENTS (Role-Specific) */}
            {activeTab === 'announcements' && (
              <AnnouncementsBoard currentUser={currentUser} />
            )}

            {/* TAB: TRAININGS (Role-Specific) */}
            {activeTab === 'trainings' && (
              <TrainingManagement currentUser={currentUser} />
            )}
          </>
        )}
      </main>

      {/* Subtle Corporate Footer with Zero Slop - Clean Light Style */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">StaffSync HRM</span>
            <span>·</span>
            <span>Role-Based Modern Human Resource Management Solution</span>
            <span>·</span>
            <span className="font-mono text-slate-600">Asia/Kolkata (IST)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
              title="Reset local storage and re-seed original demo data"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Factory Data</span>
            </button>
            <span className="text-slate-300">·</span>
            <span className="font-mono tabular-nums text-slate-500">v1.0.0 Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

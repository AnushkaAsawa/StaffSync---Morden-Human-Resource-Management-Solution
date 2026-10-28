import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import {
  ShieldCheck,
  Briefcase,
  UserCheck,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AuthPortalProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Employee');
  const [regDepartment, setRegDepartment] = useState('Engineering');

  const handleDemoLogin = (role: UserRole) => {
    setError('');
    const user = StorageService.switchUserByRole(role);
    onLoginSuccess(user);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your corporate email address.');
      return;
    }

    const user = StorageService.login(email, password);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError(
        'Account not found. Please try one of the pre-seeded demo accounts (hr@staffsync.com, manager@staffsync.com, employee@staffsync.com) or register a new user.'
      );
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regEmail.trim()) {
      setError('Please provide both your name and email.');
      return;
    }

    const newUser = StorageService.register({
      name: regName,
      email: regEmail,
      role: regRole,
      department: regDepartment,
    });

    onLoginSuccess(newUser);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Brand & Introduction */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Role-Based Enterprise Authentication</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Sign In to StaffSync HRM
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Modern Human Resource Management Solution with role-restricted workspaces for
          HR Administrators, Department Managers, and Employees.
        </p>
      </div>

      {/* 1-Click Fast Demo Login Matrix */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center sm:text-left">
          Instant 1-Click Demo Profiles (Pre-Configured Credentials)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* HR Card */}
          <div
            onClick={() => handleDemoLogin('HR')}
            className="group relative p-5 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-mono text-indigo-600 font-semibold uppercase">
                  HR Admin
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Aditi Sharma
              </h3>
              <div className="text-xs text-slate-500 font-mono">hr@staffsync.com</div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Full Employee CRUD, all leave sanctions, payroll analytics, and company-wide bulletins.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2 px-3 rounded text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Login as HR</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Manager Card */}
          <div
            onClick={() => handleDemoLogin('Manager')}
            className="group relative p-5 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Briefcase className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold uppercase">
                  Manager
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Vikram Malhotra
              </h3>
              <div className="text-xs text-slate-500 font-mono">manager@staffsync.com</div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Approve team leaves, schedule & assign training cohorts, and track team IST punches.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2 px-3 rounded text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Login as Manager</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Employee Card */}
          <div
            onClick={() => handleDemoLogin('Employee')}
            className="group relative p-5 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded bg-amber-50 text-amber-700 border border-amber-100">
                  <UserCheck className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-mono text-amber-600 font-semibold uppercase">
                  Employee
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Rahul Verma
              </h3>
              <div className="text-xs text-slate-500 font-mono">employee@staffsync.com</div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                IST punch-in/out, apply for leaves, view assigned training sessions & bulletins.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2 px-3 rounded text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Login as Employee</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Login / Register Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
        <div className="flex items-center justify-center border-b border-slate-200 pb-4 mb-6">
          <div className="inline-flex rounded-md bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              className={`px-5 py-1.5 text-xs font-semibold rounded transition-colors ${
                tab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Credentials Login
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              className={`px-5 py-1.5 text-xs font-semibold rounded transition-colors ${
                tab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create New Account
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@staffsync.com or employee@staffsync.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123 (or demo password)"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-2xs"
                />
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Demo passwords: <span className="font-mono text-slate-700 font-medium">password123</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to StaffSync</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Maya Krishnan"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="maya@staffsync.com"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Assigned Role *
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                >
                  <option value="Employee">Employee (Self-Service)</option>
                  <option value="Manager">Department Manager</option>
                  <option value="HR">HR Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Department *
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create Account & Enter Portal</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

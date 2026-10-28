import React, { useState } from 'react';
import { Employee, User } from '../types';
import { formatINR, formatDateIST } from '../utils/formatters';
import { StorageService } from '../services/storage';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';

interface EmployeeCRUDProps {
  currentUser: User;
  onDataChange?: () => void;
}

export const EmployeeCRUD: React.FC<EmployeeCRUDProps> = ({ currentUser, onDataChange }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => StorageService.getEmployees());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering' as Employee['department'],
    position: '',
    salary: 1200000,
    joinDate: new Date().toISOString().split('T')[0],
    phone: '+919876543210',
    address: 'Bengaluru, Karnataka, India',
  });

  const [formError, setFormError] = useState('');

  const isHR = currentUser.role === 'HR';

  const departments: Array<Employee['department']> = [
    'Engineering',
    'Human Resources',
    'Sales & Marketing',
    'Operations',
    'Finance',
    'Design',
  ];

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      department: 'Engineering',
      position: '',
      salary: 1200000,
      joinDate: new Date().toISOString().split('T')[0],
      phone: '+91',
      address: 'Bengaluru, Karnataka, India',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      joinDate: emp.joinDate.split('T')[0],
      phone: emp.phone,
      address: emp.address,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.position.trim()) {
      setFormError('Please fill in all mandatory employee fields.');
      return;
    }

    if (!formData.phone.startsWith('+91') && !formData.phone.startsWith('91')) {
      setFormError('Phone number must start with Indian country code (+91).');
      return;
    }

    if (editingEmployee) {
      StorageService.saveEmployee({
        ...formData,
        _id: editingEmployee._id,
        user: editingEmployee.user,
      });
    } else {
      StorageService.saveEmployee(formData);
    }

    const updated = StorageService.getEmployees();
    setEmployees(updated);
    setIsModalOpen(false);
    if (onDataChange) onDataChange();
  };

  const handleDelete = (id: string, name: string) => {
    if (!isHR) return;
    if (window.confirm(`Are you sure you want to remove ${name} from the corporate directory?`)) {
      StorageService.deleteEmployee(id);
      const updated = StorageService.getEmployees();
      setEmployees(updated);
      if (onDataChange) onDataChange();
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Total payroll computation
  const totalPayrollINR = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const avgSalaryINR = employees.length ? Math.round(totalPayrollINR / employees.length) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>Employee Directory & Records</span>
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            {isHR
              ? 'Authorized HR Access: Full Create, Read, Update, and Delete capabilities.'
              : 'Viewing organizational roster and department assignments (Read-only mode).'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isHR && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Active Headcount</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {employees.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Across 6 operational divisions</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Annual Payroll (INR ₹)</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-600">
            {formatINR(totalPayrollINR)}
          </div>
          <div className="mt-1 text-xs text-slate-500">CTC base compensation</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Average Annual Package</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-800">
            {formatINR(avgSalaryINR)}
          </div>
          <div className="mt-1 text-xs text-slate-500">Per employee mean salary</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* High-density Employee Data Grid - White Background */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3 text-right">Annual CTC (₹)</th>
              <th className="px-4 py-3">Joining Date</th>
              <th className="px-4 py-3">Contact</th>
              {isHR && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={isHR ? 7 : 6} className="px-4 py-8 text-center text-slate-500">
                  No employee profiles match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">{emp.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{emp.email}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-slate-700 font-medium">{emp.department}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                    {emp.position}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                    {formatINR(emp.salary)}
                  </td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                    {formatDateIST(emp.joinDate)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{emp.phone}</span>
                    </div>
                  </td>
                  {isHR && (
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit employee details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(emp._id, emp.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete employee record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                {editingEmployee ? 'Edit Employee Record' : 'Onboard New Employee'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                    placeholder="e.g. Rohan Nair"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                    placeholder="rohan@staffsync.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department: e.target.value as Employee['department'],
                      })
                    }
                    className="mt-1 w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Position / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                    placeholder="e.g. Senior Frontend Dev"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Annual Salary (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100000}
                    step={10000}
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="mt-1 w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-500">
                    Formatted: {formatINR(formData.salary)}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Date of Joining *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Phone (+91 format) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                    placeholder="+919876543210"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                    placeholder="Bengaluru, Karnataka"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
                >
                  {editingEmployee ? 'Update Record' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Calendar,
  AlertCircle,
  Clock,
  Trash2,
  Edit3,
  X,
  Mail,
  Check,
  ArrowUpDown
} from 'lucide-react';

import { TaskResponse, TaskRequest, TaskStatus, TaskPriority } from '../types/task';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskByEmail
} from '../service/task';
import Swal from 'sweetalert2';
import { getEmployeeEmails } from '../service/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState: TaskRequest = {
  title: '',
  description: '',
  status: 'TO_DO',
  priority: 'MEDIUM',
  dueDate: new Date().toISOString().split('T')[0],
  assignedUserEmail: ''
};

const Dashboard: React.FC = () => {
  // Current Logged-in User
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'ADMIN';

  // Data, Sort & Filter State
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'DUE_DATE' | 'PRIORITY'>('DUE_DATE');

  // Floating Toasts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [formData, setFormData] = useState<TaskRequest>(initialFormState);
  const [modalLoading, setModalLoading] = useState(false);
  const [employeeEmails, setEmployeeEmails] = useState<string[]>([]);

  // Fetch All Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      let res;

      if (isAdmin) {
        res = await getAllTasks();
      } else {
        res = await getTaskByEmail(user.email);
    
      }

      if (res.success) {
        setTasks(res.data);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    if (isAdmin) {
      const fetchEmails = async () => {
        try {
          const res = await getEmployeeEmails();
          if (res.success) {
            setEmployeeEmails(res.data);
          }
        } catch (err) {
          console.error('Failed to fetch employee emails:', err);
        }
      };
      fetchEmails();
    }
  }, []);

  // Input Validation (Regex & Rules)
  const validateTask = (data: TaskRequest): string | null => {
    if (data.title.trim().length < 3) {
      return 'Task title must be at least 3 characters long.';
    }
    if (!data.dueDate) {
      return 'Due date is required.';
    }
    const today = new Date().toISOString().split('T')[0];
    if (data.dueDate < today) {
      return 'Due date cannot be in the past.';
    }
    if (!EMAIL_REGEX.test(data.assignedUserEmail.trim())) {
      return 'Please enter a valid assignee email address.';
    }
    return null;
  };

  //  Modal Handlers
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskResponse) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedUserEmail: task.assignedUserEmail
    });
    setIsModalOpen(true);
  };

  // Submit Task Form (Create or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateTask(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setModalLoading(true);
    setError('');

    try {
      if (editingTask) {
        const res = await updateTask(editingTask.id, formData);
        if (res.success) {
          setSuccess('Task updated successfully!');
          fetchTasks();
          setIsModalOpen(false);
        }
      } else {
        const res = await createTask(formData);
        if (res.success) {
          setSuccess('Task created successfully!');
          fetchTasks();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Task (Admin Only)
  const handleDeleteTask = async (id: number) => {

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5', // Indigo-600
      cancelButtonColor: '#ef4444', // Rose-500
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(id);
        setSuccess('Task deleted successfully!');
        setTasks(tasks.filter((t) => t.id !== id));
      } catch (err: any) {
        setError('Failed to delete task.');
      }
    }
  };

  // Update Status (Dropdown Change)
  const handleStatusChange = async (id: number, newStatus: TaskStatus) => {
    try {
      const res = await updateTaskStatus(id, newStatus);
      if (res.success) {
        setSuccess('Status updated!');
        setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  // Search & Status Filter Logic
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedUserEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const priorityOrder: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
    if (sortBy === 'DUE_DATE') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'PRIORITY') {
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    return 0;
  });

  // Calculate Metrics based on role view
  const totalTasks = tasks.length;
  const todoCount = tasks.filter((t: any) => t.status === 'TO_DO').length;
  const inProgressCount = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t: any) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">

      {/* ============================================== */}
      {/* FLOATING DARK TOASTS (TOP RIGHT)               */}
      {/* ============================================== */}
      {error && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-[90%] sm:w-auto bg-[#0B1120]/95 text-white backdrop-blur-xl border border-rose-500/30 shadow-2xl rounded-2xl p-4 flex items-start gap-3.5 transition-all">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle size={16} />
          </div>
          <div className="flex-1 pr-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Action Failed</h4>
            <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-[90%] sm:w-auto bg-[#0B1120]/95 text-white backdrop-blur-xl border border-emerald-500/30 shadow-2xl rounded-2xl p-4 flex items-start gap-3.5 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={16} />
          </div>
          <div className="flex-1 pr-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Success</h4>
            <p className="text-xs text-emerald-300 mt-0.5 leading-relaxed">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ============================================== */}
      {/*    TOP ACTION & GREETING BAR                   */}
      {/* ============================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isAdmin ? 'Task Management' : 'My Assigned Tasks'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Organize, assign, and track team tasks across the workspace.'
              : 'Track your personal tasks and update progress in real-time.'}
          </p>
        </div>

        {/* Admin Only: Create Task Button */}
        {isAdmin && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-95 shrink-0"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* ============================================== */}
      {/*    STATS OVERVIEW CARDS                        */}
      {/* ============================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalTasks}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">To Do</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{todoCount}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">In Progress</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{inProgressCount}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* ============================================== */}
      {/*    SEARCH & STATUS FILTER BAR                  */}
      {/* ============================================== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, description or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <ArrowUpDown size={15} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
          >
            <option value="DUE_DATE">Sort: Due Date (Earliest)</option>
            <option value="PRIORITY">Sort: Priority (High to Low)</option>
          </select>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
          {(['ALL', 'TO_DO', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${statusFilter === status
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================== */}
      {/*    TASK CARDS GRID (ALL MANDATORY FIELDS)      */}
      {/* ============================================== */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <Clock size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? 'Click "+ Create Task" to add your first work item.'
              : 'You have no assigned tasks matching this criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Priority Badge & Admin Actions */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${task.priority === 'HIGH'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : task.priority === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                  >
                    {task.priority} PRIORITY
                  </span>

                  {/* Admin Only: Edit and Delete */}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Task Title & Description */}
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {task.description || 'No description provided.'}
                </p>

                {/* Metadata: Assignee & Due Date */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{task.assignedUserEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Status Controller (Both Admin and Employee can update status) */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </span>

                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-all ${task.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : task.status === 'IN_PROGRESS'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                >
                  <option value="TO_DO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================== */}
      {/*    CREATE & EDIT MODAL FORM (POPUP)            */}
      {/* ============================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter task details and assign an employee.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Database Schema"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide context or instructions for this task..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                />
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  >
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Assignee Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assignee Email *
                  </label>
                  <select
                    required
                    value={formData.assignedUserEmail}
                    onChange={(e) => setFormData({ ...formData, assignedUserEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="">Select Employee</option>
                    {employeeEmails.length === 0 ? (
                      <option disabled value="">No employees found</option>
                    ) : (
                      employeeEmails.map((email) => (
                        <option key={email} value={email}>
                          {email}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
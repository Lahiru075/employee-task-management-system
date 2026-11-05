import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Search, ArrowRight, Briefcase } from 'lucide-react';
import { getAllTasks } from '../service/task';
import { getAllUsers } from '../service/auth';

interface EmployeeSummary {
  email: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
}

const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, tasksRes] = await Promise.all([getAllUsers(), getAllTasks()]);

        const allUsers = usersRes.data || []; 
        const allTasks = tasksRes.data || [];
        
        const summary = allUsers.map((user: any) => {
          const userTasks = allTasks.filter((t: any) => t.assignedUserEmail === user.email);
          return {
            email: user.email,
            name: user.name,
            totalTasks: userTasks.length,
            completedTasks: userTasks.filter((t: any) => t.status === 'COMPLETED').length,
            inProgressTasks: userTasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
            todoTasks: userTasks.filter((t: any) => t.status === 'TO_DO').length,
          };
        });

        setEmployees(summary);
      } catch (err) {
        console.error('Failed to load employee data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) => emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
             emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor team workload and progress.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 text-xs font-bold">
          <Users size={16} /> <span>{employees.length} Active Members</span>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search team member..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 outline-none shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => {
            const completionRate = emp.totalTasks > 0 ? Math.round((emp.completedTasks / emp.totalTasks) * 100) : 0;
            return (
              <div key={emp.email} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md">{emp.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 capitalize">{emp.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500"><Mail size={12} /> {emp.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-4 text-center">
                  <div className="p-2 rounded-xl bg-slate-50"><span className="text-[10px] font-bold text-slate-400 uppercase">Total</span><p className="font-bold text-slate-800">{emp.totalTasks}</p></div>
                  <div className="p-2 rounded-xl bg-indigo-50"><span className="text-[10px] font-bold text-indigo-600 uppercase">Active</span><p className="font-bold text-indigo-700">{emp.inProgressTasks + emp.todoTasks}</p></div>
                  <div className="p-2 rounded-xl bg-emerald-50"><span className="text-[10px] font-bold text-emerald-600 uppercase">Done</span><p className="font-bold text-emerald-700">{emp.completedTasks}</p></div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{ width: `${completionRate}%` }} /></div>
                
                <button onClick={() => navigate('/dashboard')} className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
                  <Briefcase size={14} /> View Tasks <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Employees;
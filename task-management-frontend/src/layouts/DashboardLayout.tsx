import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    LogOut,
    Layers3,
    Menu,
    X,
    ShieldCheck,
    UserRound,
    Calendar
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user?.role === 'ADMIN';

    // Mobile Menu State
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Header Title based on route
    const getHeaderTitle = () => {
        if (location.pathname.includes('employees')) return 'Employee Directory';
        return 'Task Management';
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1120] text-slate-300 p-5 flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    }`}
            >
                <div>
                    {/* Top Logo & Mobile Close Button */}
                    <div className="flex items-center justify-between mb-8 px-2 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                <Layers3 size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-white text-lg font-bold tracking-tight">TaskFlow</h2>
                                <p className="text-slate-500 text-[9px] uppercase tracking-widest font-semibold">
                                    WORKSPACE
                                </p>
                            </div>
                        </div>

                        {/* Mobile Close (X) Icon */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1.5">
                        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Menu
                        </p>

                        {/* Tasks Link */}
                        <Link
                            to="/dashboard"
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === '/dashboard'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                        >
                            <LayoutDashboard size={18} />
                            <span>{isAdmin ? 'All Tasks' : 'My Tasks'}</span>
                        </Link>

                        {/* Employees Link (Admin Only) */}
                        {isAdmin && (
                            <Link
                                to="/employees"
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === '/employees'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                    }`}
                            >
                                <Users size={18} />
                                <span>Employees</span>
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Bottom User Profile & Logout */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 font-bold text-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">
                                {user?.name || 'User'}
                            </h4>
                            <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${isAdmin
                                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                    }`}
                            >
                                {isAdmin ? <ShieldCheck size={11} /> : <UserRound size={11} />}
                                {user?.role || 'EMPLOYEE'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Navbar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex justify-between items-center shrink-0">

                    {/* Left: Mobile Toggle & Page Title */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
                            aria-label="Open Sidebar"
                        >
                            <Menu size={20} />
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                    {getHeaderTitle()}
                                </h2>

                                {/* Dynamic Role Pill */}
                                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wide">
                                    {user?.role || 'WORKSPACE'}
                                </span>
                            </div>

                            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
                                Live workspace & task tracker
                            </p>
                        </div>
                    </div>

                    {/* Right: Date Badge & User Profile Widget */}
                    <div className="flex items-center gap-3">

                        {/* Today's Date Badge (Desktop Only) */}
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl">
                            <Calendar size={13} className="text-indigo-600" />
                            <span>
                                {new Date().toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>

                        {/* Modern User Widget */}
                        <div className="flex items-center gap-2.5 p-1 pl-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px] sm:max-w-none">
                                    {user?.name || 'User'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    {user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
                                </span>
                            </div>

                            {/* Gradient Avatar with Online Green Dot */}
                            <div className="relative">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-500/20">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                        </div>

                    </div>
                </header>

                {/* Dynamic Outlet Pages */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

        </div>
    );
};

export default DashboardLayout;
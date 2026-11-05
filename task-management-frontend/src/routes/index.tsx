import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';


const Login = lazy(() => import('../page/Login'));
const Register = lazy(() => import('../page/Register'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Dashboard = lazy(() => import('../page/Dashboard'));
const Employees = lazy(() => import('../page/Employees'));

type RequireAuthType = {
  children: ReactNode;
  allowedRoles?: string[];
};


const RequireAuth = ({ children, allowedRoles }: RequireAuthType) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-full mb-4">
          <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm">You do not have permission to access this page.</p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-600 text-sm font-semibold animate-pulse">
      Loading Task Manager...
    </p>
  </div>
);


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={
              <RequireAuth allowedRoles={['ADMIN']}>
                <Employees />
              </RequireAuth>
            } />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
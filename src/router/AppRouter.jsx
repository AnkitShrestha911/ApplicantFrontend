import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminPage from '../pages/AdminPage';
import AppLayout from '../layouts/AppLayout';
import EntryPage from '../pages/EntryPage';
import LedgerPage from '../pages/LedgerPage';
import SettingsPage from '../pages/SettingsPage';

const ProtectedRoute = ({ children, requireAdmin = false, requireApplicant = false }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/entry" replace />;
  }

  if (requireApplicant && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/register"
        element={
          <ProtectedRoute requireAdmin>
            <RegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminPage />} />
      </Route>
      <Route
        path="/*"
        element={
          <ProtectedRoute requireApplicant>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/entry" replace />} />
        <Route path="entry" element={<EntryPage />} />
        <Route path="ledger" element={<LedgerPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/entry" replace />} />
      </Route>
    </Routes>
  );
};

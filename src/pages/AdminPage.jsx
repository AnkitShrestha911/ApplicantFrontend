import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../services/api';

const AdminPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (!email.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      addToast('Please fill in all password fields', { error: true });
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      addToast('Passwords do not match', { error: true });
      return;
    }

    if (newPassword.trim().length < 8) {
      addToast('Password must be at least 8 characters', { error: true });
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/change-password', {
        email: email.trim().toLowerCase(),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      });
      addToast('Password updated successfully', { error: false });
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      addToast(message, { error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Admin Panel</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Manage applicant accounts</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Signed in as {user?.name || 'admin'}</p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-300"
          >
            + Add User
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create applicant account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use the add user button to create a new applicant account through the protected registration flow.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Change user password</h2>
          <form className="mt-6 space-y-4" onSubmit={handlePasswordChange}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">User email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                placeholder="Re-enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? 'Updating password...' : 'Change password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

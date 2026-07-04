import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { BiLogoOkRu } from "react-icons/bi";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex text-md h-9 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-3xl bg-blue-600 sm:text-xl font-bold text-white"><BiLogoOkRu className='w-6 h-6 sm:w-7 sm:h-7' /></div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Applicant Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="hidden items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 sm:flex"
            >
              <FiShield className="h-4 w-4" />
              Admin
            </button>
          )}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-100">
              <FiUser className="h-5 w-5" />
              <span className="font-medium">{user?.name ?? 'Guest'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
          >
            <FiLogOut className="h-4 w-4" />
            {loading ? 'Signing out' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

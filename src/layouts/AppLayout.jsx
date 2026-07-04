import { Outlet, NavLink } from 'react-router-dom';
import Header from '../components/Header';
import { FiPlus, FiList, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { isAdmin } = useAuth();
  const navClasses = ({ isActive }) =>
    `inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold transition ${
      isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <div className="pb-28">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
      {!isAdmin && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto flex max-w-6xl items-center justify-around">
            <NavLink to="/entry" className={navClasses}>
              <FiPlus className="mr-2 h-5 w-5" />
              Entry
            </NavLink>
            <NavLink to="/ledger" className={navClasses}>
              <FiList className="mr-2 h-5 w-5" />
              Ledger
            </NavLink>
            <NavLink to="/settings" className={navClasses}>
              <FiSettings className="mr-2 h-5 w-5" />
              Settings
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
};

export default AppLayout;

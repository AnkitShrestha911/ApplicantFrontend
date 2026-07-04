import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back, {user?.name ?? 'User'}</h2>
          <p className="mt-3 text-slate-600">This is your entry dashboard. The application layout and protected routes are now configured.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategories } from '../services/categoryService';
import { createType, deleteType, getTypes } from '../services/typeService';
import { createReferrer, deleteReferrer, getReferrers } from '../services/referrerService';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const [categories, setCategories] = useState([]);
  // const [types, setTypes] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [typeName, setTypeName] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const { addToast } = useToast();

  const loadSettings = async () => {
    try {
      const [categoryRes, typeRes, referrerRes] = await Promise.all([getCategories(), getTypes(), getReferrers()]);
      setCategories(categoryRes.data.data);
      // setTypes(typeRes.data.data);
      setReferrers(referrerRes.data.data);
    } catch (err) {
      addToast('Unable to load settings.', { error: true });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const refreshSettings = async () => {
    await loadSettings();
    setCategoryName('');
    setTypeName('');
    setReferrerName('');
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      addToast('Enter a category name', { error: true });
      return;
    }

    try {
      await createCategory({ name: categoryName.trim() });
      addToast('Category added successfully.', { error: false });
      refreshSettings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to add category.', { error: true });
    }
  };

  const handleCreateType = async (event) => {
    event.preventDefault();
    if (!typeName.trim()) {
      addToast('Enter a type name.', { error: true });
      return;
    }

    try {
      await createType({ name: typeName.trim() });
      addToast('Type added successfully.', { error: false });
      refreshSettings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to add type.', { error: true });
    }
  };

  const handleCreateReferrer = async (event) => {
    event.preventDefault();
    if (!referrerName.trim()) {
      addToast('Enter a referrer name.', { error: true });
      return;
    }

    try {
      await createReferrer({ name: referrerName.trim() });
      addToast('Referrer added successfully.', { error: false });
      refreshSettings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to add referrer.', { error: true });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      addToast('Category removed.', { error: false });
      refreshSettings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to remove category.', { error: true });
    }
  };

  const handleDeleteType = async (id) => {
    try {
      await deleteType(id);
      addToast('Type removed.', { error: false });
      refreshSettings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to remove type.', { error: true });
    }
  };

  const handleDeleteReferrer = async (id) => {
    try {
      await deleteReferrer(id);
      addToast('Referrer removed.', { error: false });
      refreshSettings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to remove referrer.', { error: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Manage categories, types, and referrers used in entry forms for your account only.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Categories</h3>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleCreateCategory}>
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              placeholder="New category"
            />
            <button className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Add category
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <span className="text-sm text-slate-700 dark:text-slate-200">{category.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category._id)}
                  className="rounded-2xl bg-rose-100 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Types</h3>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleCreateType}>
            <input
              value={typeName}
              onChange={(event) => setTypeName(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              placeholder="New type"
            />
            <button className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Add type
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {types.map((type) => (
              <div key={type._id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <span className="text-sm text-slate-700 dark:text-slate-200">{type.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteType(type._id)}
                  className="rounded-2xl bg-rose-100 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section> */}

        <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Referrers (Marfat)</h3>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleCreateReferrer}>
            <input
              value={referrerName}
              onChange={(event) => setReferrerName(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              placeholder="New referrer"
            />
            <button className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Add referrer
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {referrers.map((referrer) => (
              <div key={referrer._id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <span className="text-sm text-slate-700 dark:text-slate-200">{referrer.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteReferrer(referrer._id)}
                  className="rounded-2xl bg-rose-100 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>


    </div>
  );
};

export default SettingsPage;

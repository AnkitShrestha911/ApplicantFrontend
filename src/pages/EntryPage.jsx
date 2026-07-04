import { useEffect, useMemo, useState } from 'react';
import { createApplicant } from '../services/applicantService';
import { getCategories } from '../services/categoryService';
import { getTypes } from '../services/typeService';
import { getReferrers } from '../services/referrerService';
import { useToast } from '../context/ToastContext';
import { IoMdAddCircle } from 'react-icons/io';

const EntryPage = () => {
  const [form, setForm] = useState({
    applicantName: '',
    applicantId: '',
    referrer: '',
    categoryId: '',
    typeId: '',
    phoneNumber: '',
  });
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const loadMeta = async () => {
    try {
      const [categoryRes, typeRes, referrerRes] = await Promise.all([getCategories(), getTypes(), getReferrers()]);
      setCategories(categoryRes.data.data);
      setTypes(typeRes.data.data);
      setReferrers(referrerRes.data.data);
    } catch (err) {
      addToast('Unable to load categories, types, and referrers. Please refresh.', { error: true });
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'applicantId' || name === 'phoneNumber') {
      // Allow only numeric characters
     
      const numericValue = value.replace(/[^0-9]/g, '');
      setForm((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const trimmedForm = useMemo(
    () => ({
      applicantName: form.applicantName.trim(),
      applicantId: form.applicantId.trim(),
      referrer: form.referrer.trim(),
      categoryId: form.categoryId,
      typeId: form.typeId,
      phoneNumber: form.phoneNumber.trim(),
    }),
    [form]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    if (!trimmedForm.applicantName || !trimmedForm.applicantId || !trimmedForm.categoryId || !trimmedForm.typeId) {
      console.log("hello")
    addToast('Please complete all required fields before saving.', { error: true });
      return;
    }

    setLoading(true);
    try {
      await createApplicant(trimmedForm);
      addToast('Applicant saved successfully.');
      setForm({
        applicantName: '',
        applicantId: '',
        referrer: '',
        categoryId: '',
        typeId: '',
        phoneNumber: '',
      });
    } catch (err) {
      console.log(err);
      addToast(err.response?.data?.message || 'Unable to save applicant.', {error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        <h2 className="text-2xl flex items-center font-semibold text-slate-900 dark:text-slate-100">
          <IoMdAddCircle  size={30} className="inline-block mr-2" />
          Add New Applicant
        </h2>
      </div>

      <div className="grid gap-6 rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Applicant Name</span>
              <input
                name="applicantName"
                value={form.applicantName}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
                placeholder="Full name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Applicant ID *</span>
              <input
                name="applicantId"
                type='text'
                inputMode='numeric'
                value={form.applicantId}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
                placeholder="Numeric ID only"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Referrer (Marfat)</span>
              <select
                name="referrer"
                value={form.referrer}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              >
                <option value="">Select referrer</option>
                {referrers.map((referrer) => (
                  <option key={referrer._id} value={referrer.name}>
                    {referrer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Type *</span>
              <select
                name="typeId"
                value={form.typeId}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              >
                <option value="">Select type</option>
                {types.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</span>
              <input
                name="phoneNumber"
                type="text"
                inputMode='numeric'
                value={form.phoneNumber}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={loading}
              
              className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Saving...' : 'Save Applicant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryPage;

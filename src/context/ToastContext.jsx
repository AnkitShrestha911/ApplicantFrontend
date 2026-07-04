import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, opts = {}) => {
		const id = Date.now() + Math.random();
		const toast = { id, message, ...opts };
		setToasts((prev) => [...prev, toast]);
		const duration = opts.duration ?? 4000;
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, duration);
	}, []);

	const removeToast = useCallback(
		(id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
		[],
	);

	return (
		<ToastContext.Provider value={{ addToast, removeToast, toasts }}>
			{children}
			<div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
				{toasts.map((t) => (
					<div
						key={t.id}
						className={`max-w-xs rounded-lg px-4 py-2 text-sm font-medium shadow-lg ${t.error ? 'bg-rose-600/95 text-white' : 'bg-emerald-600/95 text-white'}`}
					>
						{t.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within ToastProvider");
	return ctx;
};

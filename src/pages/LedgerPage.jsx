import { useEffect, useMemo, useState } from "react";
import { deleteApplicant, getApplicants, updateApplicant } from "../services/applicantService";
import { getCategories } from "../services/categoryService";
import { getTypes } from "../services/typeService";
import { getReferrers } from "../services/referrerService";
import { useToast } from "../context/ToastContext";

// PDF generation will be performed via dynamic imports of `jspdf` and `jspdf-autotable`.

const LedgerPage = () => {
	const [applicants, setApplicants] = useState([]);
	const [categories, setCategories] = useState([]);
	const [types, setTypes] = useState([]);
	const [referrers, setReferrers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [editing, setEditing] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(null);
	const [formError, setFormError] = useState("");
	const [saving, setSaving] = useState(false);
	const [pdfError, setPdfError] = useState("");
	const { addToast } = useToast();

	const loadMeta = async () => {
		try {
			const [categoryRes, typeRes, referrerRes] = await Promise.all([
				getCategories(),
				getTypes(),
				getReferrers(),
			]);
			setCategories(categoryRes.data.data);
			setTypes(typeRes.data.data);
			setReferrers(referrerRes.data.data);
		} catch (err) {
			console.error(err);
		}
	};

	const loadApplicants = async () => {
		setLoading(true);
		try {
			const response = await getApplicants({ search, filter });
			setApplicants(response.data.data || []);
		} catch (err) {
			console.error(err);
			setApplicants([]);
			addToast(err.response?.data?.message || "Unable to load applicants.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMeta();
	}, []);

	useEffect(() => {
		loadApplicants();
	}, [search, filter]);

	const filteredApplicants = useMemo(() => {
		if (!dateFrom && !dateTo) return applicants;

		const from = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
		const to = dateTo ? new Date(dateTo + "T23:59:59") : null;

		setFilter("");
		return applicants.filter((a) => {
			const created = new Date(a.createdAt);
			if (from && to) return created >= from && created <= to;
			if (from) return created >= from;
			if (to) return created <= to;
			return true;
		});
	}, [applicants, dateFrom, dateTo]);

	const openEdit = (applicant) => {
		setFormError("");
		setEditing({
			...applicant,
			categoryId: applicant.category?._id || applicant.category,
			typeId: applicant.type?._id || applicant.type,
		});
	};

	const closeEdit = () => setEditing(null);

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		if (name === "applicantId") {
			// Allow only numeric characters
			const numericValue = value.replace(/[^0-9]/g, "");
			setEditing((prev) => ({ ...prev, [name]: numericValue }));
		} else {
			setEditing((prev) => ({ ...prev, [name]: value }));
		}
	};

	const openDelete = (applicant) => setConfirmDelete(applicant);
	const closeDelete = () => setConfirmDelete(null);

	const handleSave = async () => {
		if (!editing) return;
		if (
			!editing.applicantName.trim() ||
			!editing.applicantId.trim() ||
			!editing.categoryId ||
			!editing.typeId
		) {
			setFormError("All fields are required.");
			return;
		}

		setSaving(true);
		try {
			await updateApplicant(editing._id, {
				applicantName: editing.applicantName.trim(),
				applicantId: editing.applicantId.trim(),
				referrer: editing.referrer?.trim() || "None",
				categoryId: editing.categoryId,
				typeId: editing.typeId,
				phoneNumber: editing.phoneNumber?.trim() || null,
			});
			await loadApplicants();
			closeEdit();
			addToast("Applicant updated successfully.");
		} catch (err) {
			setFormError(err.response?.data?.message || "Unable to update applicant.");
			addToast(err.response?.data?.message || "Unable to update applicant.");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!confirmDelete) return;
		try {
			await deleteApplicant(confirmDelete._id);
			await loadApplicants();
			closeDelete();
			addToast("Applicant deleted.");
		} catch (err) {
			console.error(err);
			closeDelete();
		}
	};

	return (
		<div className="space-y-6">
			<div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
				<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
					Applicant Ledger
				</h2>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					Review every applicant record you've added in your account.
				</p>
			</div>

			<div className="grid gap-6 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
				<div className="flex flex-col gap-4">
					<input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by name or ID"
						className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
					/>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
						<select
							value={filter}
							onChange={(event) => setFilter(event.target.value)}
							className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
						>
							<option value="">Filter by preset</option>
							<option value="today">Today</option>
							<option value="yesterday">Yesterday</option>
							<option value="last7">Last 7 Days</option>
							<option value="last30">Last 30 Days</option>
						</select>

						<div className="flex items-center gap-2">
							<label className="text-md text-white">From</label>
							<input
								type="date"
								value={dateFrom}
								onChange={(e) => setDateFrom(e.target.value)}
								className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
							/>
						</div>

						<div className="flex items-center gap-2">
							<label className="text-md text-white">To</label>
							<input
								type="date"
								value={dateTo}
								onChange={(e) => setDateTo(e.target.value)}
								className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
							/>
						</div>

						<button
							type="button"
							onClick={() => {
								setDateFrom("");
								setDateTo("");
								setPdfError("");
							}}
							className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
						>
							Clear
						</button>

						<button
							type="button"
							onClick={async () => {
								setPdfError("");
								if (!dateFrom || !dateTo) {
									setPdfError("Please select both date from and date to");
									return;
								}

								if (dateTo < dateFrom) {
									setPdfError(
										"Invalid date range: 'To' date cannot be earlier than 'From' date.",
									);
									return;
								}

								const { jsPDF } = await import("jspdf");
								await import("jspdf-autotable");

								const doc = new jsPDF({
									orientation: "portrait",
									unit: "pt",
									format: "a4",
								});

								const pageWidth = doc.internal.pageSize.getWidth();

								const margin = 30;
								const tableWidth = pageWidth - margin * 2;
								const snoWidth = 40;
								const agentWidth = 95;
								const appIdWidth = 95;
								const categoryWidth = 80;
								const typeWidth = 60;

								const nameWidth =
									tableWidth -
									(snoWidth +
										agentWidth +
										appIdWidth +
										categoryWidth +
										typeWidth);

								const fromText = dateFrom || "-";
								const toText = dateTo || "-";

								const generatedOn = new Date();

								const generatedText = `${generatedOn.toLocaleDateString(
									"en-GB",
								)} ${generatedOn.toLocaleTimeString("en-GB", {
									hour: "2-digit",
									minute: "2-digit",
									second: "2-digit",
									hour12: false,
								})}`;

								doc.setFont("helvetica", "bold");
								doc.setFontSize(22);
								doc.text("Ledger Report", pageWidth / 2, 45, {
									align: "center",
								});

								doc.setFont("helvetica", "bold");
								doc.setFontSize(12);
								doc.text(`From: ${fromText} To: ${toText}`, pageWidth / 2, 70, {
									align: "center",
								});

								doc.setFontSize(9);
								doc.setTextColor(120, 120, 120);
								doc.text(`Generated on : ${generatedText}`, pageWidth / 2, 88, {
									align: "center",
								});

								doc.setDrawColor(0);
								doc.setLineWidth(1);
								doc.line(margin, 100, pageWidth - margin, 100);

								const body = filteredApplicants.map((a, index) => [
									index + 1,
									a.applicantName || "",
									a.referrer || "",
									a.applicantId || "",
									a.category?.name || "",
									a.type || "",
								]);

								doc.autoTable({
									startY: 115,

									margin: {
										left: margin,
										right: margin,
									},

									head: [["S.NO", "NAME", "AGENT", "APP ID", "CATEGORY", "TYPE"]],

									body,

									theme: "grid",

									styles: {
										font: "helvetica",
										fontSize: 10,
										cellPadding: 7,
										textColor: [0, 0, 0],
										lineColor: [215, 215, 215],
										lineWidth: 0.5,
										valign: "middle",
										overflow: "ellipsize",
										minCellHeight: 28,
									},
									headStyles: {
										fillColor: [235, 243, 252],
										textColor: [0, 0, 0],
										fontStyle: "bold",
										fontSize: 11,
										halign: "left",
										overflow: "visible",
										minCellHeight: 34,
										valign: "middle",
									},

									alternateRowStyles: {
										fillColor: [255, 255, 255],
									},

									bodyStyles: {
										fillColor: [255, 255, 255],
									},

									columnStyles: {
										0: {
											cellWidth: snoWidth,
											halign: "center",
										},

										1: {
											cellWidth: nameWidth,
											overflow: "linebreak",
										},

										2: {
											cellWidth: agentWidth,
										},

										3: {
											cellWidth: appIdWidth,
										},

										4: {
											cellWidth: categoryWidth,
											halign: "center",
										},

										5: {
											cellWidth: typeWidth,
										},
									},

									pageBreak: "auto",
								});

								const fileName = `ledger-report_From_${fromText}_to_${toText}_${new Date().toLocaleString().split(',').join("")}.pdf`;

								doc.save(fileName);
							}}
							className="rounded-2xl bg-red-900 px-4 py-2 text-sm font-semibold text-white "
						>
							Export PDF
						</button>
					</div>
				</div>

				{pdfError && (
					<div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
						{pdfError}
					</div>
				)}

				{loading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((index) => (
							<div
								key={index}
								className="h-24 rounded-3xl bg-slate-100 dark:bg-slate-800"
							/>
						))}
					</div>
				) : filteredApplicants.length === 0 ? (
					<div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
						No applicants found. Add an applicant from the Entry page.
					</div>
				) : (
					<div className="grid gap-4">
						{filteredApplicants.map((applicant) => (
							<div
								key={applicant._id}
								className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
							>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
											{new Date(applicant.createdAt).toLocaleDateString()}
										</p>
										<h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
											{applicant.applicantName}
										</h3>
										<p className="text-sm text-slate-500 dark:text-slate-400">
											ID: {applicant.applicantId}
										</p>
									</div>
									<div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
										<span className="font-semibold">Category </span>
										{applicant.category?.name || "No category"} •{" "}
										<span className="font-semibold">Type </span>
										{applicant.type?.name || applicant.type || "No type"}
									</div>
								</div>
								<div className="mt-4 grid gap-3 sm:grid-cols-2">
									<p className="text-sm text-slate-600 dark:text-slate-400">
										Referrer (Marfat): {applicant.referrer || "None"}
									</p>
									<p className="text-sm text-slate-600 dark:text-slate-400">
										Updated: {new Date(applicant.updatedAt).toLocaleString()}
									</p>
									{applicant.phoneNumber && (
										<p className="text-sm text-slate-600 dark:text-slate-400">
											Phone: {applicant.phoneNumber}
										</p>
									)}
								</div>
								<div className="mt-4 flex flex-wrap gap-3">
									<button
										type="button"
										onClick={() => openEdit(applicant)}
										className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() => openDelete(applicant)}
										className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{editing && (
				<div className="fixed  inset-0 z-50 flex items-stretch justify-center overflow-hidden sm:items-center sm:p-0">
					<div className="absolute  top-0 sm:pb-5 flex h-screen max-h-screen w-full max-w-lg flex-col rounded-none bg-white shadow-2xl dark:bg-slate-950 sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:rounded-3xl">
						<div className=" shrink-0 border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5">
							<div className="flex  items-start justify-between gap-4">
								<div>
									<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
										Edit Applicant
									</h3>
									<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
										Update the applicant details and save.
									</p>
								</div>
								<button
									type="button"
									onClick={closeEdit}
									className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
								>
									Cancel
								</button>
							</div>
							<div className="mt-5 flex w-full  justify-center items-center sm:hidden">
								<button
									type="button"
									onClick={handleSave}
									disabled={saving}
									className="w-60 rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:py-3"
								>
									{saving ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 sm:py-5">
							<div className="space-y-4">
								<label className="block">
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
										Applicant Name
									</span>
									<input
										name="applicantName"
										value={editing.applicantName}
										onChange={handleEditChange}
										className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
								</label>
								<label className="block">
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
										Applicant ID
									</span>
									<input
										name="applicantId"
										value={editing.applicantId}
										onChange={handleEditChange}
										className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
								</label>
								<label className="block">
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
										Referrer (Marfat)
									</span>
									<select
										name="referrer"
										value={editing.referrer || ""}
										onChange={handleEditChange}
										className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									>
										<option value="">None</option>
										{referrers.map((referrer) => (
											<option key={referrer._id} value={referrer.name}>
												{referrer.name}
											</option>
										))}
									</select>
								</label>
								<div className="grid gap-4 sm:grid-cols-2">
									<label className="block">
										<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
											Category
										</span>
										<select
											name="categoryId"
											value={editing.categoryId}
											onChange={handleEditChange}
											className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
										>
											<option value="">Choose category</option>
											{categories.map((category) => (
												<option key={category._id} value={category._id}>
													{category.name}
												</option>
											))}
										</select>
									</label>
									<label className="block">
										<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
											Type
										</span>
										<select
											name="typeId"
											value={editing.typeId}
											onChange={handleEditChange}
											className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
										>
											<option value="">Choose type</option>
											{types.map((type) => (
												<option key={type._id} value={type._id}>
													{type.name}
												</option>
											))}
										</select>
									</label>
								</div>
								<label className="block">
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
										Phone Number (Optional)
									</span>
									<input
										type="tel"
										name="phoneNumber"
										value={editing.phoneNumber || ""}
										onChange={handleEditChange}
										placeholder="e.g., +1234567890"
										className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
								</label>
								{formError && (
									<div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">
										{formError}
									</div>
								)}
							</div>
						</div>
						<div className="flex w-full justify-center ">
							<button
								type="button"
								onClick={handleSave}
								disabled={saving}
								className="w-60 rounded-3xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:py-3"
							>
								{saving ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</div>
				</div>
			)}

			{confirmDelete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
					<div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-950">
						<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Confirm deletion
						</h3>
						<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
							Are you sure you want to delete{" "}
							<span className="font-semibold text-slate-900 dark:text-slate-100">
								{confirmDelete.applicantName}
							</span>
							? This action cannot be undone.
						</p>
						<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={closeDelete}
								className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleDelete}
								className="rounded-3xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default LedgerPage;

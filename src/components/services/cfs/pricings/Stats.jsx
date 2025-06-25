import { FileClock, CircleX, Clock, Verified } from "lucide-react";
import { useEffect, useState } from "react";

export default function Stats({ original, requests, setRequests }) {
	const [Stats, setStats] = useState({
		pending: 0,
		approved: 0,
		rejected: 0,
		in_progress: 0,
	});

	// For Stats
	useEffect(() => {
		if (requests?.length > 0) {
			let pending = 0, approved = 0, rejected = 0, in_progress = 0;
			requests.forEach((request) => {
				switch (request?.status) {
					case 'Accepted':
						approved += 1;
						break;
					case 'Rejected':
						rejected += 1;
						break;
					case 'Pending':
						pending += 1;
						break;
					case 'In Progress':
						in_progress += 1;
						break;
				}
			});
			setStats({ pending, approved, rejected, in_progress });
		}
	}, [requests]);

	return (
		<div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 cursor-pointer">
			<div
				onClick={() => setRequests(original.filter(order => order?.status === 'Accepted'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">Approved</h4>
					<Verified className="bg-green-100 text-green-500 w-10 h-10 rounded-md p-1.5 border-2 border-green-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.approved}</h1>
			</div>
			<div
				onClick={() => setRequests(original.filter(order => order?.status === 'Pending'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">Pending</h4>
					<Clock className="bg-yellow-100 text-yellow-500 w-10 h-10 rounded-md p-1.5 border-2 border-yellow-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.pending}</h1>
			</div>
			<div
				onClick={() => setRequests(original.filter(order => order?.status === 'In Progress'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">In Progress</h4>
					<FileClock className="bg-gray-100 text-gray-500 w-10 h-10 rounded-md p-1.5 border-2 border-gray-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.in_progress}</h1>
			</div>
			<div
				onClick={() => setRequests(original.filter(order => order?.status === 'Rejected'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">Rejected</h4>
					<CircleX className="bg-red-100 text-red-500 w-10 h-10 rounded-md p-1.5 border-2 border-red-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.rejected}</h1>
			</div>
		</div>
	)
}

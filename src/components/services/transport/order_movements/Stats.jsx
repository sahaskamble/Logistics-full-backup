import { FileClock, CircleX, Clock, Verified } from "lucide-react";
import { useEffect, useState } from "react";

export default function Stats({ original, detail, setDetail }) {
	const [Stats, setStats] = useState({
		in_transit: 0,
		delivered: 0,
		cancelled: 0,
		not_started: 0,
	});

	// For Stats
	useEffect(() => {
		if (detail?.length > 0) {
			let in_transit = 0, delivered = 0, cancelled = 0, not_started = 0;
			detail.forEach((request) => {
				switch (request?.status) {
					case 'Delivered':
						delivered += 1;
						break;
					case 'Cancelled':
						cancelled += 1;
						break;
					case 'In Transit':
						in_transit += 1;
						break;
					case 'Not Started':
						not_started += 1;
						break;
				}
			});
			setStats({ in_transit, delivered, cancelled, not_started });
		}
	}, [detail]);

	return (
		<div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 cursor-pointer">
			<div
				onClick={() => setDetail(original.filter(order => order?.status === 'Accepted'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">Delivered</h4>
					<Verified className="bg-green-100 text-green-500 w-10 h-10 rounded-md p-1.5 border-2 border-green-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.delivered}</h1>
			</div>
			<div
				onClick={() => setDetail(original.filter(order => order?.status === 'in_transit'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">In Transit</h4>
					<Clock className="bg-yellow-100 text-yellow-500 w-10 h-10 rounded-md p-1.5 border-2 border-yellow-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.in_transit}</h1>
			</div>
			<div
				onClick={() => setDetail(original.filter(order => order?.status === 'Not Started'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">Not Started</h4>
					<FileClock className="bg-gray-100 text-gray-500 w-10 h-10 rounded-md p-1.5 border-2 border-gray-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.not_started}</h1>
			</div>
			<div
				onClick={() => setDetail(original.filter(order => order?.status === 'Cancelled'))}
				className="border rounded-lg p-6 grid gap-2 shadow-md shadow-foreground/40 bg-[var(--accent)]"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-base">Cancelled</h4>
					<CircleX className="bg-red-100 text-red-500 w-10 h-10 rounded-md p-1.5 border-2 border-red-500" />
				</div>
				<h1 className="text-3xl font-semibold">{Stats.cancelled}</h1>
			</div>
		</div>
	)
}

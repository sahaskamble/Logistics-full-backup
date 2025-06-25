import { CircleCheckBig, CircleDashed, CircleX, Database, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  calculateOrderStats,
  generateMonthlyTrends,
  generateServiceDistribution,
  getRecentRequests,
  getStatusColor
} from '@/utils/dashboardHelpers';

const COLORS = ['#ef4444', '#14b8a6', '#fbbf24', '#1e3a8a', '#f97316'];

export default function Stats({ orders = [], serviceRequests = [], jobOrders = [] }) {
	const [stats, setStats] = useState({
		total: 0,
		approved: 0,
		rejected: 0,
		pending: 0,
		inProgress: 0,
		completed: 0
	});

	const [chartData, setChartData] = useState({
		monthlyTrends: [],
		serviceDistribution: [],
		recentRequests: []
	});

	useEffect(() => {
		console.log("Stats component received:", { orders, serviceRequests, jobOrders });

		// Calculate order statistics
		const orderStats = calculateOrderStats(orders);
		console.log(orders);

		console.log(orderStats);
		setStats(orderStats);

		// Generate chart data
		const monthlyTrends = generateMonthlyTrends(orders);
		const serviceDistribution = generateServiceDistribution(serviceRequests);
		const recentRequests = getRecentRequests(serviceRequests);

		console.log("Generated chart data:", { monthlyTrends, serviceDistribution, recentRequests });

		setChartData({
			monthlyTrends,
			serviceDistribution,
			recentRequests
		});
	}, [orders, serviceRequests, jobOrders]);

	return (
		<div>
			<div className="md:w-full w-auto grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
				<div className="bg-accent rounded-lg p-6 grid gap-2 shadow-2xl w-full">
					<div className="flex justify-between">
						<div className="">
							<h4 className="text-sm flex">Total Orders</h4>
							<h1 className="text-3xl font-semibold">{stats.total}</h1>
						</div>
						<div className="border-0 rounded-full bg-amber-50 p-3 h-fit">
							<ScrollText className="text-black" size={25} />
						</div>
					</div>
				</div>

				<div className="bg-accent rounded-lg p-6 grid gap-2 shadow-2xl w-full">
					<div className="flex justify-between">
						<div className="">
							<h4 className="text-sm flex">Pending Orders</h4>
							<h1 className="text-3xl font-semibold">{stats.pending}</h1>
						</div>
						<div className="border-0 rounded-full bg-orange-200 p-3 h-fit">
							<CircleDashed className="text-orange-600" size={25} />
						</div>
					</div>
				</div>

				<div className="bg-accent rounded-lg p-6 grid gap-2 shadow-2xl w-full">
					<div className="flex justify-between">
						<div className="">
							<h4 className="text-sm flex">Approved Orders</h4>
							<h1 className="text-3xl font-semibold">{stats.approved}</h1>
						</div>
						<div className="border-0 rounded-full bg-green-200 p-3 h-fit">
							<CircleCheckBig className="text-green-600" size={25} />
						</div>
					</div>
				</div>

				<div className="bg-accent rounded-lg p-6 grid gap-2 shadow-2xl w-full">
					<div className="flex justify-between">
						<div className="">
							<h4 className="text-sm flex">Rejected Orders</h4>
							<h1 className="text-3xl font-semibold">{stats.rejected}</h1>
						</div>
						<div className="border-0 rounded-full bg-red-200 p-3 h-fit">
							<CircleX className="text-red-600" size={25} />
						</div>
					</div>
				</div>
			</div>


			{/* Line Chart */}
			<div className="grid md:grid-cols-2 gap-6 py-6 h-fit text-gray-900">
				<div className="bg-[#e6f4ea] rounded-xl p-4 shadow-md border border-green-300">
					<h2 className="text-lg font-semibold text-black mb-2">Total Order Trends</h2>
					<ResponsiveContainer width="100%" height={220}>
						<LineChart data={chartData.monthlyTrends}>
							<CartesianGrid strokeDasharray="3 3" stroke="#cce3d2" />
							<XAxis dataKey="month" stroke="#555" />
							<YAxis stroke="#555" />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="orders"
								stroke="#10b981"
								strokeWidth={2}
								dot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Pie Chart */}
				<div className="bg-accent rounded-lg p-4 shadow-md border border-green-200">
					<h2 className="text-lg font-semibold mb-2">Service Usage Distribution</h2>
					{chartData.serviceDistribution.length > 0 ? (
						<div className="flex justify-between">
							<ResponsiveContainer width="50%" height={200}>
								<PieChart>
									<Pie
										data={chartData.serviceDistribution}
										cx="50%"
										cy="50%"
										innerRadius={50}
										outerRadius={80}
										dataKey="value"
										paddingAngle={5}
									>
										{chartData.serviceDistribution.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
							<div className="flex flex-col justify-center pr-[10%]">
								<ul className="text-sm mt-2 space-y-1">
									{chartData.serviceDistribution.map((entry, index) => (
										<li key={index} className="flex items-center">
											<span
												className="inline-block w-3 h-3 rounded-full mr-2"
												style={{ backgroundColor: COLORS[index % COLORS.length] }}
											></span>
											{entry.name}
										</li>
									))}
								</ul>
							</div>
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							<p>No service data available</p>
						</div>
					)}
				</div>
			</div>


			<div className="grid md:grid-cols-2 gap-6 py-6 h-fit text-gray-900">
				{/* Bar Chart */}
				<div className="bg-[#e6f4ea] rounded-xl p-4 shadow-md border border-green-300">
					<h2 className="text-lg font-semibold text-black mb-2">Approved Orders</h2>
					<ResponsiveContainer width="100%" height={220}>
						<BarChart data={chartData.monthlyTrends}>
							<CartesianGrid strokeDasharray="3 3" stroke="#cce3d2" />
							<XAxis dataKey="month" stroke="#555" />
							<YAxis stroke="#555" />
							<Tooltip />
							<Bar
								dataKey="approved"
								fill="#15803d"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Latest Requests */}
				<div className="bg-accent rounded-lg p-4 shadow-md border border-green-200">
					<h2 className="text-lg font-semibold mb-4">Latest Requests</h2>
					{chartData.recentRequests.length > 0 ? (
						<ul className="space-y-4 text-sm">
							{chartData.recentRequests.map((req, idx) => (
								<li key={idx} className="flex justify-between border-b pb-2">
									<div>
										<p className="font-medium">#{req.id.slice(-8)}</p>
										<p className="text-gray-600">{req.service}</p>
									</div>
									<p className={`font-semibold ${getStatusColor(req.status)}`}>
										{req.status}
									</p>
								</li>
							))}
						</ul>
					) : (
						<div className="text-center py-8 text-gray-500">
							<p>No recent requests</p>
						</div>
					)}
				</div>
			</div>

			{/* </div> */}



		</div>
	)
}

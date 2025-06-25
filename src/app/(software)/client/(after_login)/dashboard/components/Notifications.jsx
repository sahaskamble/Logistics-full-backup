import { Bell } from "lucide-react";

export default function Notifications() {
	return (
		<div className="border-2 p-6 rounded-xl">
			<h1 className="text-xl font-semibold pb-2">Notifications</h1>
			{notificationsList.map((notification, index) => (
				<h1 key={index} className="flex items-center gap-4 py-2">
					<Bell className="text-[var(--primary)]" />
					<span>{notification.title}</span>
				</h1>
			))}

		</div>
	)
}

const notificationsList = [
	{
		title: 'Request #RQ105 - Special Equipment request pending'
	},
	{
		title: 'Job Order #JORD2391 has been approved'
	},
	{
		title: 'Tariff document uploaded by Red Ocean for review'
	},
];


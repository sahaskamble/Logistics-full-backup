"use client";

import { useState, useEffect } from "react";
import { Bell, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./sheet";

// Notification data for different user types
const notificationData = {
	Customer: [
		{
			id: 1,
			title: "Tariff updated for May 2025.",
			type: "info",
			timestamp: "2 hours ago",
			read: false,
		},
		{
			id: 2,
			title: "Your recent order was delivered on 11-May-2025.",
			type: "success",
			timestamp: "1 day ago",
			read: false,
		},
		{
			id: 3,
			title: "Payment reminder for Invoice #INV-2024-001",
			type: "warning",
			timestamp: "3 days ago",
			read: true,
		},
	],
	Client: [
		{
			id: 1,
			title: "Request #RQ105 - Special Equipment request pending",
			type: "warning",
			timestamp: "1 hour ago",
			read: false,
		},
		{
			id: 2,
			title: "Job Order #JORD2391 has been approved",
			type: "success",
			timestamp: "4 hours ago",
			read: false,
		},
		{
			id: 3,
			title: "Tariff document uploaded by Red Ocean for review",
			type: "info",
			timestamp: "1 day ago",
			read: true,
		},
		{
			id: 4,
			title: "Container #CONT-789 inspection completed",
			type: "success",
			timestamp: "2 days ago",
			read: true,
		},
	],
	GOL: [
		{
			id: 1,
			title: "Request #RQ105 - Special Equipment request pending",
			type: "warning",
			timestamp: "30 minutes ago",
			read: false,
		},
		{
			id: 2,
			title: "Job Order #JORD2391 has been approved",
			type: "success",
			timestamp: "2 hours ago",
			read: false,
		},
		{
			id: 3,
			title: "Tariff document uploaded by Red Ocean for review",
			type: "info",
			timestamp: "5 hours ago",
			read: false,
		},
		{
			id: 4,
			title: "New pricing request from Client ABC Corp",
			type: "info",
			timestamp: "1 day ago",
			read: true,
		},
		{
			id: 5,
			title: "System maintenance scheduled for tonight",
			type: "warning",
			timestamp: "2 days ago",
			read: true,
		},
	],
};

// Get icon based on notification type
const getNotificationIcon = (type) => {
	switch (type) {
		case "success":
			return <CheckCircle className="w-5 h-5 text-green-500" />;
		case "warning":
			return <AlertCircle className="w-5 h-5 text-yellow-500" />;
		case "error":
			return <AlertCircle className="w-5 h-5 text-red-500" />;
		default:
			return <Info className="w-5 h-5 text-blue-500" />;
	}
};

// Get notification count for badge
const getUnreadCount = (userType) => {
	const notifications = notificationData[userType] || [];
	return notifications.filter((notification) => !notification.read).length;
};

export default function NotificationSheet({ userType = "Customer" }) {
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState(notificationData[userType] || []);
	const unreadCount = notifications.filter((notification) => !notification.read).length;

	// Update notifications when userType changes
	useEffect(() => {
		setNotifications(notificationData[userType] || []);
	}, [userType]);

	const handleNotificationClick = (notificationId) => {
		// Mark notification as read when clicked
		setNotifications(prev =>
			prev.map(notification =>
				notification.id === notificationId
					? { ...notification, read: true }
					: notification
			)
		);
	};

	const markAllAsRead = () => {
		setNotifications(prev =>
			prev.map(notification => ({ ...notification, read: true }))
		);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button className="relative" aria-label="Notifications">
					<Bell className="w-5 h-5 md:w-6 md:h-6" />
					{unreadCount > 0 && (
						<div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
							{unreadCount > 9 ? "9+" : unreadCount}
						</div>
					)}
				</button>
			</SheetTrigger>
			<SheetContent side="right" className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<Bell className="w-5 h-5" />
						{userType} Notifications
					</SheetTitle>
				</SheetHeader>
				<div className="flex-1 overflow-y-auto mt-4">
					{notifications.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-32 text-gray-500">
							<Bell className="w-8 h-8 mb-2 opacity-50" />
							<p>No notifications yet</p>
						</div>
					) : (
						<div className="space-y-3">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									onClick={() => handleNotificationClick(notification.id)}
									className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${!notification.read
											? "bg-blue-50 border-blue-200"
											: "bg-white border-gray-200"
										}`}
								>
									<div className="flex items-start gap-3">
										{getNotificationIcon(notification.type)}
										<div className="flex-1 min-w-0">
											<p
												className={`text-sm ${!notification.read
														? "font-semibold text-gray-900"
														: "font-normal text-gray-700"
													}`}
											>
												{notification.title}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Clock className="w-3 h-3 text-gray-400" />
												<span className="text-xs text-gray-500">
													{notification.timestamp}
												</span>
												{!notification.read && (
													<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				{notifications.length > 0 && unreadCount > 0 && (
					<div className="mt-4 pt-4 border-t">
						<button
							onClick={markAllAsRead}
							className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
						>
							Mark all as read
						</button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

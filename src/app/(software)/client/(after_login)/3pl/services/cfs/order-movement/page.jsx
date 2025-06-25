'use client';

import OrderMovements3PL from "@/components/services/3pl/order_movements/OrderMovements3PL";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function OrdersMovementPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Order Movements');
	}, []);

	return (
		<OrderMovements3PL service='CFS' />
	)
};

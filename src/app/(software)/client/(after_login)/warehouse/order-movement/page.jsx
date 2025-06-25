'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseOrderMovements from "@/components/services/warehouse/order_movements/WarehouseOrderMovements";

export default function OrdersMovementPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Order Movements');
	}, []);

	return (
		<WarehouseOrderMovements />
	)
};

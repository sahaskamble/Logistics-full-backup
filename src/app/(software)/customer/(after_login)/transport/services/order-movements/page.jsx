'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import TransportOrderMovements from "@/components/services/transport/order_movements/TransportOrderMovements";

export default function OrderManagementPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Transportation Order Movements')
	}, []);

	return (
		<section className="grid gap-8">
			<TransportOrderMovements />
		</section>
	);
};

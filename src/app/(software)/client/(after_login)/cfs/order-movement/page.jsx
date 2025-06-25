'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSOrderMovements from "@/components/services/cfs/order_movements/CFSOrderMovements";

export default function OrdersMovementPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Order Movements');
	}, []);

	return (
		<section>
			<CFSOrderMovements />
		</section>
	)
};

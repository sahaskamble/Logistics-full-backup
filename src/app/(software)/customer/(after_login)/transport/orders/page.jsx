'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import TransportOrderTable from "@/components/services/transport/orders/TransportOrderTable";

export default function Order() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('My Orders')
	}, []);

	return (
		<section className="grid gap-8">
			<TransportOrderTable />
		</section>
	)
}

'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseOrderTable from "@/components/services/warehouse/orders/WarehouseOrderTable";

export default function Order() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Customer Orders')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseOrderTable />
		</section>
	)
}

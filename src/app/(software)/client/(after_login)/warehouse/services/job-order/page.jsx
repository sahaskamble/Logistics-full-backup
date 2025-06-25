'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseJobOrderPage from "@/components/services/warehouse/job_orders/WarehouseJobOrderPage";

export default function JobOrderUpdatePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Job Order Update')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseJobOrderPage />
		</section>
	)
};

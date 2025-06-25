'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseServiceRequests from "@/components/services/warehouse/service_requests/WarehouseServiceRequests";


export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Service Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseServiceRequests />
		</section>
	)
};

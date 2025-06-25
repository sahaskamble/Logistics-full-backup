'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehousePricingsRequests from "@/components/services/warehouse/pricings/WarehousePricingsRequests";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Pricing Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehousePricingsRequests />
		</section>
	)
};

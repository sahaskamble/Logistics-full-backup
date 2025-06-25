'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseServices from "@/components/services/warehouse/services/WarehouseServices";

export default function TaxInvoicePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Tax Invoice')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseServices serviceName="Tax Invoice" />
		</section>
	)
};

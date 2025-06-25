'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseServices from "@/components/services/warehouse/services/WarehouseServices";

export default function WeighmentSlipPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Weighment Slip')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseServices serviceName="Weighment Slip" />
		</section>
	)
};

'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseServices from "@/components/services/warehouse/services/WarehouseServices";

export default function EIRPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('EIR Copy');
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseServices serviceName="EIR Copy" />
		</section>
	)
};

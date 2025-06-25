'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseServices from "@/components/services/warehouse/services/WarehouseServices";

export default function ChequeAcceptancePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Cheque Acceptance')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseServices serviceName="Cheque Acceptance" />
		</section>
	)
};

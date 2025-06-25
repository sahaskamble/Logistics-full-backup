'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseServices from "@/components/services/warehouse/services/WarehouseServices";

export default function ContainerGroundingPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Container Grounding')
	}, []);

	return (
		<section className="grid gap-8">
			<WarehouseServices serviceName="Container Grounding" />
		</section>
	)
};

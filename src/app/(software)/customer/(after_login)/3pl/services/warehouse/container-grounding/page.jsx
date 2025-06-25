'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import Services3PL from "@/components/services/3pl/services/Services3PL";

export default function ContainerGroundingPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Container Grounding')
	}, []);

	return (
		<section className="grid gap-8">
			<Services3PL service="Warehouse" serviceName="Container Grounding" />
		</section>
	)
};

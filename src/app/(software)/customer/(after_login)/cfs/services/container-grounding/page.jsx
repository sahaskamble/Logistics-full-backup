'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSServices from "@/components/services/cfs/services/CFSServices";

export default function ContainerGroundingPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Container Grounding')
	}, []);

	return (
		<section className="grid gap-8">
			<CFSServices serviceName="Container Grounding" />
		</section>
	)
}


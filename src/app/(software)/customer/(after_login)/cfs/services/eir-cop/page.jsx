'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSServices from "@/components/services/cfs/services/CFSServices";

export default function EIRPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('EIR Copy');
	}, []);

	return (
		<section className="grid gap-8">
			<CFSServices serviceName="EIR Copy" />
		</section>
	)
}


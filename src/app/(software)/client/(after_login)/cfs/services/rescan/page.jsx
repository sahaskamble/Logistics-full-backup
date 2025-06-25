'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSServices from "@/components/services/cfs/services/CFSServices";

export default function ReScanningPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Re-Scanning')
	}, []);

	return (
		<section className="grid gap-8">
			<CFSServices serviceName="Re-Scanning" />
		</section>
	)
}


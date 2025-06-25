'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSServices from "@/components/services/cfs/services/CFSServices";

export default function WeighmentSlipPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Weighment Slip')
	}, []);

	return (
		<section className="grid gap-8">
			<CFSServices serviceName="Weighment Slip" />
		</section>
	)
}


'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSServices from "@/components/services/cfs/services/CFSServices";

export default function ChequeAcceptancePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Cheque Acceptance')
	}, []);

	return (
		<section className="grid gap-8">
			<CFSServices serviceName="Cheque Acceptance" />
		</section>
	)
};

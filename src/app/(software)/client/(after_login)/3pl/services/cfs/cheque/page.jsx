'use client';

import Services3PL from "@/components/services/3pl/services/Services3PL";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function ChequeAcceptancePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Cheque Acceptance')
	}, []);

	return (
		<section className="grid gap-8">
			<Services3PL service="CFS" serviceName="Cheque Acceptance" />
		</section>
	)
};

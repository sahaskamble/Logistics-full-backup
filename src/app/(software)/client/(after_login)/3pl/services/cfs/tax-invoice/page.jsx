'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import Services3PL from "@/components/services/3pl/services/Services3PL";

export default function TaxInvoicePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Tax Invoice')
	}, []);

	return (
		<section className="grid gap-8">
			<Services3PL service="CFS" serviceName="Tax Invoice" />
		</section>
	)
};

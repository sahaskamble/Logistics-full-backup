'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSPricingsRequests from "@/components/services/cfs/pricings/CFSPricingsRequests";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Pricing Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<CFSPricingsRequests />
		</section>
	)
}


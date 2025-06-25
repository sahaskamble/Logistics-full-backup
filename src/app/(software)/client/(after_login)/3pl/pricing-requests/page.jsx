'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import PricingsRequests3PL from "@/components/services/3pl/pricings/PricingsRequests3PL";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Pricing Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<PricingsRequests3PL />
		</section>
	)
};

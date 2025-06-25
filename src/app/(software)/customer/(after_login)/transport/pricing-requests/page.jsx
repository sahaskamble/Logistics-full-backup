'use client';

import TransportPricingsRequests from "@/components/services/transport/pricings/TransportPricingsRequests";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Pricing Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<TransportPricingsRequests />
		</section>
	)
};

'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import TransportServiceRequests from "@/components/services/transport/service_requests/TransportServiceRequests";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Service Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<TransportServiceRequests />
		</section>
	)
};

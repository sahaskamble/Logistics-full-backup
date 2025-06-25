'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import JobOrderPage3PL from "@/components/services/3pl/job_orders/JobOrderPage3PL";

export default function JobOrderUpdatePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Job Order Update')
	}, []);

	return (
		<section className="grid gap-8">
			<JobOrderPage3PL service="Transport" />
		</section>
	)
};

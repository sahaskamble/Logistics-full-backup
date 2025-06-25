'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSOrderTable from "@/components/services/cfs/orders/CFSOrderTable";

export default function Order() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Customer Orders')
	}, []);

	return (
		<section className="grid gap-8">
			<CFSOrderTable />
		</section>
	)
}

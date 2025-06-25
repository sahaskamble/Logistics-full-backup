'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import OrderTable3PL from "@/components/services/3pl/orders/OrderTable3PL";

export default function Order() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('My Orders')
	}, []);

	return (
		<section className="grid gap-8">
			<OrderTable3PL />
		</section>
	)
}

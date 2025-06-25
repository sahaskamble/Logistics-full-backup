'use client';

import CFSTariffs from "@/components/services/cfs/tariffs/CFSTariffs";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<CFSTariffs />
	)
};

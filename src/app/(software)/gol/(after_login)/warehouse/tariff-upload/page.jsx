'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseTariffs from "@/components/services/warehouse/tariffs/WarehouseTariffs";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<WarehouseTariffs />
	)
};

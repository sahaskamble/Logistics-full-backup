'use client';

import Tariffs3PL from "@/components/services/3pl/tariffs/Tariffs3PL";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<Tariffs3PL service="CFS" />
	)
};

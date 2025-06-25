'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import VehicleManagementTable from "@/components/services/vehicles/VehicleManagementTable";

export default function VehicleManagementPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Vehicles Management');
	}, []);

	return (
		<section>
			<VehicleManagementTable />
		</section>
	)
};

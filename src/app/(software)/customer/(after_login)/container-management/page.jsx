'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import ContainerManagementTable from "@/components/services/container/ContainerManagementTable";

export default function ContainerManagementPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Containers Management');
	}, []);

	return (
		<section>
			<ContainerManagementTable />
		</section>
	)
};

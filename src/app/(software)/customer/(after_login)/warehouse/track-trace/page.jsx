'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import WarehouseTrackTrace from "@/components/services/warehouse/track-and-trace/WarehouseTrackTrace";

export default function TrackTrace() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Track & Trace');
	}, []);

	return (
		<WarehouseTrackTrace />
	)
}


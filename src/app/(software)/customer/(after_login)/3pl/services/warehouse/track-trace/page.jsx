'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import TrackTrace3PL from "@/components/services/3pl/track-and-trace/TrackTrace3PL";

export default function TrackTrace() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Track & Trace');
	}, []);

	return (
		<TrackTrace3PL service="Warehouse" />
	)
}


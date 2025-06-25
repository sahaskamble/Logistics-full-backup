'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSTrackTrace from "@/components/services/cfs/track-and-trace/CFSTrackTrace";

export default function TrackTrace() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Track & Trace');
	}, []);

	return (
		<CFSTrackTrace />
	)
}


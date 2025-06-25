"use client";

import { SidebarProvider } from "@/contexts/SidebarProvider";
import Sidebar from "@/components/ui/Sidebar";
import ProtectedRoutes from "@/contexts/ProtectedRoutes";
import { ROLES } from "@/constants/roles";

export default function RootGOLLayout({ children }) {
	return (
		<ProtectedRoutes allowedRoles={[ROLES.GOL_MOD, ROLES.GOL_STAFF, ROLES.ROOT]}>
			<SidebarProvider>
				<Sidebar access="GOL">{children}</Sidebar>
			</SidebarProvider>
		</ProtectedRoutes>
	);
}

"use client";

import { SidebarProvider } from "@/contexts/SidebarProvider";
import Sidebar from "@/components/ui/Sidebar";
import ProtectedRoutes from "@/contexts/ProtectedRoutes";
import { ROLES } from "@/constants/roles";

export default function RootClientLayout({ children }) {
	return (
		<ProtectedRoutes allowedRoles={[ROLES.MERCHANT, ROLES.ROOT]}>
			<SidebarProvider>
				<Sidebar access="Client">{children}</Sidebar>
			</SidebarProvider>
		</ProtectedRoutes>
	);
}

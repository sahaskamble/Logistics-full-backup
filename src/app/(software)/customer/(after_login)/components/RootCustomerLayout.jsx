"use client";

import { SidebarProvider } from "@/contexts/SidebarProvider";
import Sidebar from "@/components/ui/Sidebar";
import ProtectedRoutes from "@/contexts/ProtectedRoutes";
import { ROLES } from "@/constants/roles";

export default function RootCustomerLayout({ children }) {
	return (
		<ProtectedRoutes allowedRoles={[ROLES.CUSTOMER, ROLES.ROOT]}>
			<SidebarProvider>
				<Sidebar access="Customer">{children}</Sidebar>
			</SidebarProvider>
		</ProtectedRoutes>
	);
}

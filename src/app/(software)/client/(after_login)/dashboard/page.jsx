"use client";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useAuth } from "@/contexts/AuthContext";
import Stats from "./components/Stats";
import { Package, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/Table";
import { dashboardCols } from "./components/columns";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileTable from "./components/MobileTable";
import { useCollection } from "@/hooks/useCollection";
import {
  transformOrderData,
  filterOrdersForClient,
  filterServiceRequestsForClient
} from "@/utils/dashboardHelpers";

export default function ClientDashboardPage() {
  const { setTitle } = useSidebar();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Fetch data using useCollection hook for different collections
  const {
    data: ordersData,
    error: ordersError
  } = useCollection('cfs_orders', {
    expand: 'cfs,customer,containers,createdBy',
    sort: '-created'
  });

  const {
    data: serviceRequestsData,
    error: serviceRequestsError
  } = useCollection('cfs_service_requests', {
    expand: 'user,order,serviceType',
    sort: '-created'
  });

  const {
    data: jobOrdersData,
    error: jobOrdersError
  } = useCollection('cfs_job_order', {
    expand: 'order,serviceType,containers',
    sort: '-created'
  });

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  // Filter data based on user role (Client/Merchant specific)
  const filteredOrders = filterOrdersForClient(ordersData, user);
  const filteredServiceRequests = filterServiceRequestsForClient(serviceRequestsData || [], user);
  const filteredJobOrders = jobOrdersData || [];

  // Transform orders data for display
  const transformedOrders = transformOrderData(filteredOrders);

  // Check if we're still loading any data
  const isLoading = !ordersData && !serviceRequestsData && !jobOrdersData;

  // Check for any errors
  const hasError = ordersError || serviceRequestsError || jobOrdersError;

  if (isLoading) {
    return (
      <section className="grid gap-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="grid gap-8">
        <div className="p-6 rounded-xl shadow-2xl bg-red-50 border border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600">
            {hasError.message || 'Failed to load dashboard data. Please try refreshing the page.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-8">
      <Stats
        orders={filteredOrders}
        serviceRequests={filteredServiceRequests}
        jobOrders={filteredJobOrders}
      />

      <div className="p-6 rounded-xl shadow-2xl bg-[var(--accent)]">
        <h1 className="text-xl font-semibold mb-4">Recent Orders</h1>
        {transformedOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No orders found for your account</p>
            <p className="text-sm mt-2">
              {user?.role === 'Merchant'
                ? 'Orders you create will appear here'
                : 'Your orders will appear here once available'
              }
            </p>
          </div>
        ) : isMobile ? (
          <MobileTable orders={transformedOrders.slice(0, 5)} />
        ) : (
          <DataTable
            data={transformedOrders.slice(0, 5)}
            columns={dashboardCols}
            displayButtons={false}
            displayFilters={false}
          />
        )}
      </div>
    </section>
  );
}

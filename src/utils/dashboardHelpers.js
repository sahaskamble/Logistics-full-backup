import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Calculate statistics from orders data
 */
export function calculateOrderStats(orders = []) {
	const stats = {
		total: orders.length,
		pending: 0,
		approved: 0,
		rejected: 0,
		inProgress: 0,
		completed: 0
	};

	orders.forEach(order => {
		switch (order.status) {
			case 'Pending':
				stats.pending++;
				break;
			case 'Accepted':
				stats.approved++;
				break;
			case 'Rejected':
				stats.rejected++;
				break;
			case 'In Progress':
				stats.inProgress++;
				break;
			case 'Completed':
				stats.completed++;
				break;
		}
	});

	return stats;
}

/**
 * Generate monthly trend data for charts
 */
export function generateMonthlyTrends(orders = [], months = 5) {
	const now = new Date();
	const monthlyData = [];

	for (let i = months - 1; i >= 0; i--) {
		const monthDate = subMonths(now, i);
		const monthStart = startOfMonth(monthDate);
		const monthEnd = endOfMonth(monthDate);

		const monthOrders = orders.filter(order => {
			const orderDate = parseISO(order.created);
			return orderDate >= monthStart && orderDate <= monthEnd;
		});

		const approvedOrders = monthOrders.filter(order => order.status === 'Accepted');

		monthlyData.push({
			month: format(monthDate, 'MMM'),
			orders: monthOrders.length,
			approved: approvedOrders.length
		});
	}

	return monthlyData;
}

/**
 * Generate service usage distribution data
 */
export function generateServiceDistribution(serviceRequests = []) {
	const serviceCount = {};

	serviceRequests.forEach(request => {
		const serviceName = request.expand?.serviceType?.title || 'Unknown Service';
		serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
	});

	return Object.entries(serviceCount).map(([name, value]) => ({
		name,
		value
	}));
}

/**
 * Get recent requests for display
 */
export function getRecentRequests(serviceRequests = [], limit = 3) {
	return serviceRequests
		.slice(0, limit)
		.map(request => ({
			id: request.id,
			service: request.expand?.serviceType?.title || 'Service Request',
			status: request.status || 'Pending',
			created: request.created
		}));
}

/**
 * Transform PocketBase order data to match the expected format for Client/Merchant dashboard
 */
export function transformOrderData(orders = []) {
	if (!orders || !Array.isArray(orders)) return [];

	return orders.map(order => ({
		id: order.id,
		IGMNo: order.igmNo || 'N/A',
		BLNo: order.blNo || 'N/A',
		BOENo: order.boeNo || 'N/A',
		containerNo: order.expand?.containers?.[0]?.containerNo || 'N/A',
		cfs: {
			id: order.expand?.cfs?.id || '',
			title: order.expand?.cfs?.title || 'N/A',
			location: order.expand?.cfs?.location || 'N/A'
		},
		customer: {
			id: order.expand?.customer?.id || '',
			name: getCustomerName(order.expand?.customer)
		},
		uploadedOn: order.created ? format(parseISO(order.created), 'dd MMMM yyyy') : 'N/A',
		fromDate: order.fromDate ? format(parseISO(order.fromDate), 'dd MMMM yyyy') : 'N/A',
		toDate: order.toDate ? format(parseISO(order.toDate), 'dd MMMM yyyy') : 'N/A',
		service: 'CFS',
		commodityDescription: order.orderDescription || 'N/A',
		pickUpLocation: order.expand?.cfs?.location || 'N/A',
		containerSize: order.expand?.containers?.[0]?.size || 'N/A',
		deliveryLocation: 'N/A', // This might need to be added to schema
		cargoType: order.expand?.containers?.[0]?.cargoType || 'N/A',
		expectedDate: order.toDate ? format(parseISO(order.toDate), 'dd MMMM yyyy') : 'N/A',
		weight: 'N/A', // This might need to be added to schema
		status: order.status || 'Pending',
		updatedAt: order.updated ? format(parseISO(order.updated), 'dd MMMM yyyy') : 'N/A',
		consigneeName: order.consigneeName || 'N/A',
		chaName: order.chaName || 'N/A',
		merchantVerified: order.merchantVerified || false,
		golVerified: order.golVerified || false,
		createdBy: getCreatedByName(order.expand?.createdBy)
	}));
}

/**
 * Helper function to get customer name from user object
 */
function getCustomerName(customer) {
	if (!customer) return 'N/A';

	if (customer.name) return customer.name;

	const firstName = customer.firstname || '';
	const lastName = customer.lastname || '';
	const fullName = `${firstName} ${lastName}`.trim();

	if (fullName) return fullName;

	return customer.username || customer.email || 'N/A';
}

/**
 * Helper function to get created by name from user object
 */
function getCreatedByName(createdBy) {
	if (!createdBy) return 'N/A';

	if (createdBy.name) return createdBy.name;

	const firstName = createdBy.firstname || '';
	const lastName = createdBy.lastname || '';
	const fullName = `${firstName} ${lastName}`.trim();

	if (fullName) return fullName;

	return createdBy.username || createdBy.email || 'N/A';
}

/**
 * Get status color class for UI
 */
export function getStatusColor(status) {
	switch (status) {
		case 'Accepted':
		case 'Completed':
			return 'text-green-600';
		case 'Rejected':
			return 'text-red-600';
		case 'In Progress':
		case 'Pending':
			return 'text-yellow-600';
		default:
			return 'text-gray-600';
	}
}

/**
 * Get status background color class for badges
 */
export function getStatusBadgeColor(status) {
	switch (status) {
		case 'Accepted':
		case 'Completed':
			return 'bg-green-100 text-green-800 border border-green-500';
		case 'Rejected':
			return 'bg-red-100 text-red-800 border border-red-500';
		case 'In Progress':
			return 'bg-blue-100 text-blue-800 border border-blue-500';
		case 'Pending':
			return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
		default:
			return 'bg-gray-100 text-gray-800 border border-gray-500';
	}
}

/**
 * Format date for display
 */
export function formatDisplayDate(dateString) {
	if (!dateString) return 'N/A';
	try {
		return format(parseISO(dateString), 'dd MMM yyyy');
	} catch (error) {
		return 'Invalid Date';
	}
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
	if (total === 0) return 0;
	return Math.round((value / total) * 100);
}

/**
 * Filter orders for client/merchant based on user role and ID
 */
export function filterOrdersForClient(orders = [], user) {
	if (!orders || !user) return [];

	// For Merchant role, show orders they created
	if (user.role === 'Merchant') {
		return orders.filter(order => order?.expand?.cfs?.author === user.id);
	}

	// For other roles, show all orders (fallback)
	return orders;
}

/**
 * Filter service requests for client/merchant
 */
export function filterServiceRequestsForClient(serviceRequests = [], user) {
	if (!serviceRequests || !Array.isArray(serviceRequests) || !user) return [];

	// For Merchant role, they can see all service requests (to process them)
	return serviceRequests;
}

/**
 * Get dashboard statistics specifically for client/merchant
 */
export function getClientDashboardStats(orders = [], serviceRequests = [], jobOrders = []) {
	const orderStats = calculateOrderStats(orders);

	// Additional client-specific stats
	const serviceRequestStats = calculateOrderStats(serviceRequests);
	const jobOrderStats = calculateOrderStats(jobOrders);

	return {
		orders: orderStats,
		serviceRequests: serviceRequestStats,
		jobOrders: jobOrderStats,
		totalActiveItems: orderStats.total + serviceRequestStats.total + jobOrderStats.total
	};
}

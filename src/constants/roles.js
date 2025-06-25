// Role constants based on backend schema
export const ROLES = {
	ROOT: 'Root',
	GOL_MOD: 'GOLMod',
	GOL_STAFF: 'GOLStaff',
	MERCHANT: 'Merchant',
	CUSTOMER: 'Customer'
};

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
	[ROLES.ROOT]: 100,
	[ROLES.GOL_MOD]: 80,
	[ROLES.GOL_STAFF]: 60,
	[ROLES.MERCHANT]: 40,
	[ROLES.CUSTOMER]: 20
};

// Route access mapping
export const ROUTE_ACCESS = {
	// Customer routes
	'/customer': [ROLES.CUSTOMER, ROLES.ROOT],

	// Merchant/Client routes  
	'/client': [ROLES.MERCHANT, ROLES.ROOT],

	// GOL routes
	'/gol': [ROLES.GOL_MOD, ROLES.GOL_STAFF, ROLES.ROOT],

	// Admin routes (Root only)
	'/admin': [ROLES.ROOT]
};

// Default dashboard routes for each role
export const DEFAULT_DASHBOARDS = {
	[ROLES.ROOT]: '/admin/dashboard',
	[ROLES.GOL_MOD]: '/gol/dashboard',
	[ROLES.GOL_STAFF]: '/gol/dashboard',
	[ROLES.MERCHANT]: '/client/dashboard',
	[ROLES.CUSTOMER]: '/customer/dashboard'
};

// Login page mapping
export const LOGIN_PAGES = {
	[ROLES.CUSTOMER]: '/customer/login',
	[ROLES.MERCHANT]: '/client/login',
	[ROLES.GOL_MOD]: '/gol/login',
	[ROLES.GOL_STAFF]: '/gol/login',
	[ROLES.ROOT]: '/admin/login'
};

// Sidebar access mapping (what sidebar to show)
export const SIDEBAR_ACCESS = {
	[ROLES.CUSTOMER]: 'Customer',
	[ROLES.MERCHANT]: 'Client',
	[ROLES.GOL_MOD]: 'GOL',
	[ROLES.GOL_STAFF]: 'GOL',
	[ROLES.ROOT]: 'ROOT' // Special case - can access all
};

// Helper functions
export const hasRole = (userRole, requiredRoles) => {
	if (!userRole || !requiredRoles) return false;
	if (userRole === ROLES.ROOT) return true; // Root can access everything
	return requiredRoles.includes(userRole);
};

export const hasHigherRole = (userRole, compareRole) => {
	if (!userRole || !compareRole) return false;
	return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[compareRole];
};

export const canAccessRoute = (userRole, pathname) => {
	if (!userRole) return false;
	if (userRole === ROLES.ROOT) return true; // Root can access everything

	// Check route access
	for (const [route, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
		if (pathname.startsWith(route)) {
			return allowedRoles.includes(userRole);
		}
	}

	return false;
};

export const getDefaultDashboard = (userRole) => {
	return DEFAULT_DASHBOARDS[userRole] || '/';
};

export const getLoginPage = (userRole) => {
	return LOGIN_PAGES[userRole] || '/';
};

export const getSidebarAccess = (userRole) => {
	return SIDEBAR_ACCESS[userRole] || 'Customer';
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
	[ROLES.ROOT]: 'System Administrator',
	[ROLES.GOL_MOD]: 'GOL Moderator',
	[ROLES.GOL_STAFF]: 'GOL Staff',
	[ROLES.MERCHANT]: 'Merchant/Client',
	[ROLES.CUSTOMER]: 'Customer'
};

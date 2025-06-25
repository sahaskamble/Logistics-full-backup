'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROLES, hasRole, canAccessRoute, getDefaultDashboard } from '@/constants/roles';

export default function ProtectedRoutes({ children, allowedRoles = [] }) {
	const { user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [authorized, setAuthorized] = useState(false);

	useEffect(() => {
		// Check if user is authenticated
		if (!user) {
			// Redirect to appropriate login page based on current path
			if (pathname.includes('/customer/')) {
				router.push('/customer/login');
			} else if (pathname.includes('/client/')) {
				router.push('/client/login');
			} else if (pathname.includes('/gol/')) {
				router.push('/gol/login');
			} else if (pathname.includes('/admin/')) {
				router.push('/admin/login');
			} else {
				router.push('/');
			}
			return;
		}

		// Root user can access everything
		if (user.role === ROLES.ROOT) {
			setAuthorized(true);
			return;
		}

		// Check if user has required role (if allowedRoles is specified)
		if (allowedRoles.length > 0) {
			if (!hasRole(user.role, allowedRoles)) {
				// Redirect to user's default dashboard
				const defaultDashboard = getDefaultDashboard(user.role);
				router.push(defaultDashboard);
				return;
			}
		} else {
			// If no allowedRoles specified, check route access
			if (!canAccessRoute(user.role, pathname)) {
				// Redirect to user's default dashboard
				const defaultDashboard = getDefaultDashboard(user.role);
				router.push(defaultDashboard);
				return;
			}
		}

		setAuthorized(true);
	}, [user, router, pathname, allowedRoles]);

	// Show loading or nothing while checking authorization
	if (!authorized) {
		return null;
	}

	return children;
}

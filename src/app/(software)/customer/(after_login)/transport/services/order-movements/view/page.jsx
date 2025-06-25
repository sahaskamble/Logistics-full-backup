'use client';

import { useRouter } from 'next/navigation'

export default function RedirectViewPage() {
	const router = useRouter()
	return router.replace('customer/transport/order-movements');
};

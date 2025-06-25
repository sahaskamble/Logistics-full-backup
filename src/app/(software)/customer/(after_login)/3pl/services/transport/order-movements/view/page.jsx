'use client';

import { useRouter } from 'next/navigation'

export default function RedirectViewPage() {
	const router = useRouter()
	return router.replace('customer/3pl/transport/order-movements');
};

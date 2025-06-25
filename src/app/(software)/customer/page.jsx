'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function RedirectToLogin() {
	const router = useRouter();
	useEffect(() => {
		if (router) {
			router.push('/customer/login')
		}
	}, [router]);

	return (
		<div></div>
	)
}

'use client';

import { useCollection } from '@/hooks/useCollection';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { geocodeLocation } from './utils/leafletHelpers';
import { CircleCheckBig } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

// Dynamically load LiveTracking with SSR disabled
const LiveTracking = dynamic(() => import('./components/LiveTracking'), {
	ssr: false,
});

export default function Page() {
	const { recordId } = useParams();
	const [startLocation, setStartLocation] = useState({ latitude: 0, longitude: 0, address: '' });
	const [endLocation, setEndLocation] = useState({ latitude: 0, longitude: 0, address: '' });

	const { data: order_movement, updateItem, mutation } = useCollection('transport_order_movement', {
		expand: 'order,order.provider,jobOrder,vehicle',
		filter: `id="${recordId}"`,
	});
	const detail = order_movement?.[0];
	const { user } = useAuth();


	// Co-ordinates fetching
	useEffect(() => {
		const fetchData = async () => {
			setStartLocation({ ...startLocation, address: detail.expand?.order?.startLocation || '' });
			setEndLocation({ ...endLocation, address: detail.expand?.order?.endLocation || '' });

			const start = (detail?.startLocation?.lat === 0 && detail?.startLocation?.lon === 0)
				? detail.expand?.order?.startLocation
				: detail?.startLocation;

			const end = (detail?.endLocation?.lat === 0 && detail?.endLocation?.lon === 0)
				? detail.expand?.order?.endLocation
				: detail.endLocation

			if (start?.lat && start?.lon) {
				setStartLocation({ ...startLocation, latitude: start.lat, longitude: start.lon });
			} else {
				const geo = await geocodeLocation(start);
				if (geo) setStartLocation({ ...startLocation, latitude: geo.lat, longitude: geo.lon });
			}

			if (end?.lat && end?.lon) {
				setEndLocation({ ...endLocation, latitude: end.lat, longitude: end.lon });
			} else {
				const geo = await geocodeLocation(end);
				if (geo) setEndLocation({ ...endLocation, latitude: geo.lat, longitude: geo.lon });
			}
		}

		if (detail) {
			fetchData();
		}
	}, [detail]);

	const updateStartLocation = async ({ lat, lng }) => {
		try {
			await updateItem(detail?.id, {
				startLocation: {
					lon: lng,
					lat: lat,
				},
				status: 'In Transit'
			});
			toast.success('Journey Started, good luck...');
		} catch (error) {
			toast.error('Error updating the start location');
			console.log('Error updating the start location', error);
		} finally {
			mutation();
		}
	}

	const updateCurrentLocation = async ({ lat, lng }) => {
		try {
			await updateItem(detail?.id, {
				currentLocation: {
					lon: lng,
					lat: lat,
				},
			});
		} catch (error) {
			console.log('Error updating the current location', error);
		} finally {
			mutation();
		}
	}

	const updateDestinationLocation = async ({ lat, lng }) => {
		try {
			await updateItem(detail?.id, {
				endLocation: {
					lon: lng,
					lat: lat,
				},
				status: 'Delivered'
			});
			toast.success('Order delivered successfully...');
		} catch (error) {
			toast.error('Error closing the ride');
			console.log('Error closing the ride', error);
		} finally {
			mutation();
		}
	}


	if (!detail)
		return <div className="p-8 text-red-600 text-center">Movement not found.</div>;

	if (detail?.status === 'Delivered') {
		return (
			<div
				style={{ width: '100%', height: '100dvh' }}
				className='flex flex-col items-center justify-center bg-primary text-background gap-8'
			>
				<CircleCheckBig className='w-[40%] h-[40%]' />
				<h1 className='lg:text-6xl md:text-4xl text-2xl pt-8'>
					The Order is delivered successfully
				</h1>
				<div className='flex items-center gap-4'>
					{
						(user?.id) && (
							<Link href={'/merchant/dashboard'}>
								<Button
									className='rounded-xl pl-10 pr-10'
									textSize='lg:text-4xl md:text-2xl text-lg'
									title={'Return to Dashboard'}
									variant={'outline-invert'}
								/>
							</Link>
						)
					}
					<Link href={'/'}>
						<Button
							className='rounded-xl pl-10 pr-10'
							textSize='lg:text-4xl md:text-2xl text-lg'
							title={'Return to Home'}
							variant={'invert'}
						/>
					</Link>
				</div>
			</div>
		);
	} else {
		return (
			<div className='min-h-screen overflow-x-hidden'>
				<LiveTracking
					start={startLocation}
					destination={endLocation}
					detail={detail}
					updateStart={updateStartLocation}
					updateCurrent={updateCurrentLocation}
					closeRide={updateDestinationLocation}
				/>
			</div>
		);
	}
}

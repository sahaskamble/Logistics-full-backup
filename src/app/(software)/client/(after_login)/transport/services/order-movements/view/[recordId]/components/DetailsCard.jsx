import Button from '@/components/ui/Button';
import { MessageSquareMore, PhoneOutgoing } from 'lucide-react';
import React, { useState } from 'react'

export default function DetailsCard({ detail }) {
	const [activeTab, setActiveTab] = useState('driver');
	const startDate = new Date(detail?.startDate).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});

	const endDate = new Date(detail?.endDate).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});

	const getStatusColor = (status) => {
		switch (status) {
			case 'Delivered':
				return 'bg-green-100 text-green-800';
			case 'In Transit':
				return 'bg-yellow-100 text-yellow-800';
			case 'Cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};


	return (
		<div className="bg-accent rounded-lg shadow-sm border min-w-[50%] mt-4">
			{/* Tab Navigation */}
			<div className="flex border-b">
				{[
					{ id: 'order', label: 'Order details' },
					{ id: 'driver', label: 'Driver information' },
					{ id: 'vehicle', label: 'Vehicle' },
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
							? 'text-primary'
							: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="p-6">
				{activeTab === 'driver' && (
					<div>
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold">{detail?.driver?.name}</h3>
								<p className="text-gray-600">+91 {detail?.driver?.contact}</p>
							</div>

							<div className="flex space-x-4">
								<Button
									icon={<PhoneOutgoing className='w-4 h-4 text-background' />}
									className='rounded-xl'
									title={'Call'}
									iconPosition='right'
								/>
								<Button
									icon={<MessageSquareMore className='w-4 h-4 text-primary' />}
									className='rounded-xl'
									title={'Chat'}
									iconPosition='right'
									variant={'outline'}
								/>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'order' && (
					<div className="relative grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
						<div className={`${getStatusColor(detail.status)} rounded-xl px-2 py-1 text-center text-sm absolute top-0 right-0`}>
							{detail.status}
						</div>

						{/* Row */}
						<div className='lg:col-span-3 md:col-span-2 col-span-1'>
							<p className="text-sm text-gray-600 mb-1 md:col-span-3">Order ID</p>
							<p className="font-medium">{detail?.order}</p>
						</div>

						{/* Names */}
						<div>
							<p className="text-sm text-gray-600 mb-1">Consignee Name</p>
							<p className="font-medium">{detail?.expand?.order?.consigneeName}</p>
						</div>
						<div className='lg:col-span-2 col-span-1'>
							<p className="text-sm text-gray-600 mb-1">CHA Name</p>
							<p className="font-medium">{detail?.expand?.order?.chaName}</p>
						</div>

						{/* Date */}
						<div className='lg:col-span-3 md:col-span-2 col-span-1'>
							<p className="text-sm text-gray-600 mb-1">Period</p>
							<p className="font-medium">
								{startDate !== 'Invalid Date' ? startDate : ' Not Yet Delivered'} -
								{endDate !== 'Invalid Date' ? endDate : ' Not Yet Delivered'}
							</p>
						</div>

						{/* Description */}
						<div>
							<p className="text-sm text-gray-600 mb-1">Special Request</p>
							<p className="font-medium">{detail?.expand?.order?.specialRequest}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Order Description</p>
							<p className="font-medium">{detail?.expand?.order?.orderDescription}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Vehicle Description</p>
							<p className="font-medium">{detail?.expand?.order?.vehicleDescription}</p>
						</div>
					</div>
				)}

				{activeTab === 'vehicle' && (
					<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-600 mb-1">Vehicle No.</p>
							<p className="font-medium">{detail?.expand?.vehicle?.vehicleNo}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Vehicle Name.</p>
							<p className="font-medium">{detail?.expand?.vehicle?.name}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}


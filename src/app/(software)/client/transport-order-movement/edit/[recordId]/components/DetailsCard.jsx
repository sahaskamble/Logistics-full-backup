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
		<div className={`bg-accent rounded-b-lg	shadow-sm border lg:min-w-[50dvw] md:min-w-[65dvw] min-w-[80%]`}>
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
					<div className="md:flex space-y-2 items-center justify-between gap-4">
						<div>
							<p className="text-sm text-gray-600 mb-1">Driver Name</p>
							<p className="font-medium">{detail?.driver?.name}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Driver No.</p>
							<p className="font-medium">+91 {detail?.driver?.contact}</p>
						</div>
					</div>
				)}

				{activeTab === 'order' && (
					<>
						<div className="md:flex space-y-2 items-center justify-between gap-4">
							{/* Names */}
							<div>
								<p className="text-sm text-gray-600 mb-1">Starting Point</p>
								<p className="font-medium">{detail?.expand?.order?.startLocation}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1 md:text-right">Destination</p>
								<p className="font-medium">{detail?.expand?.order?.endLocation}</p>
							</div>
						</div>

						<div className="md:flex space-y-2 items-center justify-between gap-4 pt-4">
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
								<p className="text-sm text-gray-600 mb-1 md:text-right">Vehicle Description</p>
								<p className="font-medium">{detail?.expand?.order?.vehicleDescription}</p>
							</div>
						</div>
					</>
				)}

				{activeTab === 'vehicle' && (
					<div className="md:flex space-y-2 items-center justify-between gap-4">
						<div>
							<p className="text-sm text-gray-600 mb-1">Vehicle No.</p>
							<p className="font-medium">{detail?.expand?.vehicle?.vehicleNo}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1 md:text-right">Vehicle Name.</p>
							<p className="font-medium">{detail?.expand?.vehicle?.name}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}


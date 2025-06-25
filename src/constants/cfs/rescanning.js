export const rescannings = [
	{
		id: 'RES-001',
		order: {
			id: 'ORD-001',
			cfs: {
				id: 'chennai-cfs',
				title: "Chennai Port CFS",
				location: "Chennai Port, Tamil Nadu",
			},
		},
		containerNo: 'HJK1122334',
		consigneeName: 'ABC Shipping Pvt Ltd',
		jobOrderId: 'JO-003',
		date: '15 January 2024',
		type: 'Full X-Ray Scan',
		scannedBy: 'Shashank',
		remarks: 'Rescan complete - no issues found',
		status: 'Completed',
		files: [
			{ path: '' }
		]
	},
	{
		id: 'RES-002',
		order: {
			id: 'ORD-001',
			cfs: {
				id: 'chennai-cfs',
				title: "Chennai Port CFS",
				location: "Chennai Port, Tamil Nadu",
			},
		},
		containerNo: 'TGH9876543',
		consigneeName: 'ABC Shipping Pvt Ltd',
		jobOrderId: 'JO-003',
		date: '15 January 2024',
		type: 'Visual Inspection',
		scannedBy: 'Shashank',
		remarks: 'Rescan complete - no issues found',
		status: 'Completed',
		files: [
			{ path: '' }
		]
	},
]

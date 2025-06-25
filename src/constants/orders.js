export const orders = [
	{
		id: 'ORD-001',
		IGMNo: '2025/IGM001',
		BLNo: 'MSCUHK123456',
		BOENo: '1234567/2025',
		containerNo: 'MSCU1234567',
		cfs: {
			id: 'chennai-cfs',
			title: "Chennai Port CFS",
			location: "Chennai Port, Tamil Nadu",
		},
		customer: {
			id: 'abc'
		},
		uploadedOn: '10 January 2024',
		fromDate: '10 January 2024',
		toDate: '20 January 2024',
		service: 'CFS',
		commodityDescription: 'Pepsi',
		pickUpLocation: 'Chennai Port',
		containerSize: '20ft',
		deliveryLocation: 'Warehouse no. 1, Coimbatore',
		cargoType: 'Liquid',
		expectedDate: '20 January 2024',
		weight: '100',
		status: 'Accepted',
		updatedAt: '21 January 2024',
		containerMovement: [
			{
				id: 'PM-1',
				status: 'Discharged',
				location: 'Chennai Port',
				locationURL: '',
				filePaths: [''],
				collection: 'priorityMovements',
				date: '10 January 2024 08:30',
				remarks: 'Unloaded from Vessel',
			},
			{
				id: 'PM-2',
				status: 'Customs Hold',
				location: 'Chennai Port CFS',
				locationURL: '',
				filePaths: [''],
				collection: 'priorityMovements',
				date: '12 January 2024 14:00',
				remarks: 'Awaiting Documentation',
			},
			{
				id: 'PM-3',
				status: 'Cleared',
				location: 'Chennai Port CFS',
				locationURL: '',
				filePaths: [''],
				collection: 'priorityMovements',
				date: '15 January 2024 17:00',
				remarks: 'Cleared by Customs',
			},
			{
				id: 'PM-4',
				status: 'Gate Out',
				location: 'Chennai Port CFS',
				locationURL: '',
				filePaths: [''],
				collection: 'priorityMovements',
				date: '16 January 2024 10:00',
				remarks: 'Moved to Transport Yard',
			},
			{
				id: 'PM-5',
				status: 'Delivered',
				location: 'Client Warehouse - Coimbatore',
				locationURL: '',
				filePaths: [''],
				collection: 'priorityMovements',
				date: '20 January 2024 09:00',
				remarks: 'Successfully Delivered to Warehouse',
			},
		],
	},
	{
		id: 'ORD-002',
		IGMNo: '2025/IGM002',
		BLNo: 'MAEUIN654321',
		BOENo: '7654321/2025',
		containerNo: 'TGHU7654321',
		cfs: {
			id: 'mumbai-central-terminal',
			title: 'Mumbai CFS Terminal',
			location: "Nhava Sheva, Mumbai, Maharashtra",
		},
		customer: {
			id: 'abc'
		},
		uploadedOn: '7 May 2025',
		fromDate: '7 May 2025',
		toDate: '17 May 2025',
		service: 'CFS',
		commodityDescription: 'Lays',
		pickUpLocation: 'Mumbai Seaport',
		containerSize: '20ft',
		deliveryLocation: 'Warehouse no. 15, Sector-5, Bhiwandi',
		cargoType: 'Dry',
		expectedDate: '20 January 2024',
		weight: '50',
		status: 'Rejected',
		updatedAt: '21 January 2024',
		containerMovement: [
			// Order Cancelled
		],
	},
];

export const tariffs = [
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2024',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/updated-tariff.pdf',
		uploadedOn: '14 January 2024',
		remarks: 'Revised',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2023',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2024',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/updated-tariff.pdf',
		uploadedOn: '14 January 2024',
		remarks: 'Revised',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2023',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2024',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/updated-tariff.pdf',
		uploadedOn: '14 January 2024',
		remarks: 'Revised',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2023',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2024',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/updated-tariff.pdf',
		uploadedOn: '14 January 2024',
		remarks: 'Revised',
		order: {
			id: 'ORD-001'
		},
	},
	{
		filePath: '/tariff.pdf',
		uploadedOn: '12 January 2023',
		remarks: 'Handling',
		order: {
			id: 'ORD-001'
		},
	},
];

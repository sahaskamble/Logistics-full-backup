export const cfsRequestsLists = [
	{
		id: 'abc',
		provider: {
			id: 'gfs',
			title: 'Global Freight Logistics Limited',
			location: 'Mumbai Port, India',
		},
		date: '15 January 2024',
		status: 'pending',
	},
	{
		id: 'ghi',
		provider: {
			id: 'gfs',
			title: 'Global Freight Logistics Limited',
			location: 'Mumbai Port, India',
		},
		date: '13 January 2024',
		status: 'rejected',
	},
	{
		id: 'xyz',
		provider: {
			id: 'chennai-cfs',
			title: "Chennai Port CFS",
			location: "Chennai Port, Tamil Nadu",
		},
		date: '10 January 2024',
		status: 'gol-approved',
	},
	{
		id: 'def',
		provider: {
			id: 'mumbai-central-terminal',
			title: 'Mumbai CFS Terminal',
			location: "Nhava Sheva, Mumbai, Maharashtra",
		},
		date: '14 January 2023',
		status: 'approved',
	},
];

export const filterValues = {
	status: [
		{
			id: 'approved',
			label: 'Approved',
		},
		{
			id: 'gol-approved',
			label: 'GOL Approved',
		},
		{
			id: 'rejected',
			label: 'Rejected',
		},
		{
			id: 'pending',
			label: 'Pending',
		},
	],
};

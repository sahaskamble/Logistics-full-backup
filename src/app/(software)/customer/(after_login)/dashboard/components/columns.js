export const dashboardCols = [
	{
		id: 'order-no',
		accessorKey: 'id',
		header: 'Order ID',
		filterable: true,
		cell: ({ row }) => (
			<div className="font-medium text-blue-600">
				{row.original.id}
			</div>
		),
	},
	{
		id: 'bl',
		accessorKey: 'BLNo',
		header: 'BL No.',
		filterable: true,
		cell: ({ row }) => (
			<div className="text-sm">
				{row.original.BLNo || 'N/A'}
			</div>
		),
	},
	{
		id: 'boe',
		accessorKey: 'BOENo',
		header: 'BOE No.',
		filterable: true,
		cell: ({ row }) => (
			<div className="text-sm">
				{row.original.BOENo || 'N/A'}
			</div>
		),
	},
	{
		id: 'igm',
		accessorKey: 'IGMNo',
		header: 'IGM No.',
		filterable: true,
		cell: ({ row }) => (
			<div className="text-sm">
				{row.original.IGMNo || 'N/A'}
			</div>
		),
	},
	{
		id: 'cfs',
		accessorKey: 'cfs.title',
		header: 'CFS',
		filterable: true,
		cell: ({ row }) => (
			<div className="text-sm">
				<div className="font-medium">{row.original.cfs?.title || 'N/A'}</div>
				<div className="text-gray-500 text-xs">{row.original.cfs?.location || ''}</div>
			</div>
		),
	},
	{
		id: 'status',
		accessorKey: 'status',
		header: 'Status',
		filterable: true,
		cell: ({ row }) => (
			<div className={`${getStatusColor(row.original.status)} rounded-xl px-3 py-1 text-center text-sm font-medium`}>
				{row.original.status || 'Pending'}
			</div>
		),
	},
	{
		id: 'updated',
		accessorKey: 'updatedAt',
		header: 'Last Updated',
		filterable: false,
		cell: ({ row }) => (
			<div className="text-sm text-gray-600">
				{row.original.updatedAt || 'N/A'}
			</div>
		),
	},
]

const getStatusColor = (status) => {
	switch (status) {
		case 'Accepted':
		case 'Completed':
			return 'bg-green-100 text-green-800 border border-green-300';
		case 'Pending':
			return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
		case 'Rejected':
			return 'bg-red-100 text-red-800 border border-red-300';
		case 'In Progress':
			return 'bg-blue-100 text-blue-800 border border-blue-300';
		default:
			return 'bg-gray-100 text-gray-800 border border-gray-300';
	}
};
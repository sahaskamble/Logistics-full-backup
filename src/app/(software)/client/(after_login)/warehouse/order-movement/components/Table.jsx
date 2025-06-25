import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection'
import { Download, Eye, Trash } from 'lucide-react'
import Form from './Form';
import EditForm from './EditForm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Table() {
	const { data, deleteItem } = useCollection('warehouse_order_movement', {
		expand: 'order,order.provider',
	});
	const { user } = useAuth();
	const [filteredData, setFilteredData] = useState([]);

	const columns = [
		{
			id: 'id',
			accessorKey: 'id',
			header: 'Order No',
			filterable: true,
			cell: ({ row }) => <div>{row.original.order}</div>,
		},
		{
			id: 'igmNo',
			accessorKey: 'igmNo',
			header: 'IGM No',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.order?.igmNo}</div>,
		},
		{
			id: 'blNo',
			accessorKey: 'blNo',
			header: 'BL No',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.order?.blNo}</div>,
		},
		{
			id: 'boeNo',
			accessorKey: 'boeNo',
			header: 'BOE No',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.order?.boeNo}</div>,
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: 'Status',
			filterable: true,
			cell: ({ row }) => <div className='font-semibold'>{row.original.status}</div>,
		},
		{
			id: 'remarks',
			accessorKey: 'remarks',
			header: 'Remarks',
			filterable: true,
			cell: ({ row }) => <div>{row.original.remarks}</div>,
		},
		{
			id: 'date',
			accessorKey: 'date',
			header: 'Execution Date',
			filterable: true,
			cell: ({ row }) => <div>
				{
					new Date(row.original.date).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})
				}
			</div>,
		},
		{
			id: 'actions',
			accessorKey: 'actions',
			header: 'Actions',
			filterable: false,
			cell: ({ row }) => (
				<div className='flex gap-2 items-center justify-center'>
					<Eye
						size={18}
						className="cursor-pointer text-primary"
					/>
					<EditForm info={row.original} />
					<Trash
						size={18}
						className="cursor-pointer text-primary"
						onClick={async () => {
							console.log('Delete details for', row.original.id);
							const confirmation = confirm('Are you sure you want to delete this container?');
							if (confirmation) {
								await deleteItem(row.original.id);
							}
						}}
					/>
					<Download
						size={18}
						className="cursor-pointer text-primary"
					/>
				</div>
			),
		}
	];

	useEffect(() => {
		if (data?.length > 0 && user?.id) {
			console.log(data);
			const filtered_data = data.filter((item) => item?.expand?.order?.expand?.provider?.author === user?.id);
			setFilteredData(filtered_data);
		}
	}, [data]);

	return (
		<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
			{
				useIsMobile() ? (
					<>
						<h1 className="text-xl font-semibold p-4">Order Movements</h1>
						<div className="flex justify-end p-4">
							<Form />
						</div>
						<MobileDataTable
							columns={columns}
							data={filteredData}
						/>
					</>
				) : (
					<>
						<div className="flex items-center justify-between gap-4">
							<h1 className="text-lg font-semibold">Order Movements</h1>
							<Form />
						</div>

						<DataTable
							columns={columns}
							data={filteredData}
						/>
					</>
				)
			}
		</div>
	)
}


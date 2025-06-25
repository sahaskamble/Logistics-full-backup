import { DataTable } from '@/components/ui/Table';
import { CircleCheckBig, CircleX, Eye, Trash, } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import EditForm from './EditForm';
import { useAuth } from '@/contexts/AuthContext';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import Stats from './Stats';
import React from 'react'
import { toast } from 'sonner';
import RejectForm from './RejectForm';

export default function TransportPricingsRequests() {
	const { data, deleteItem, updateItem, mutation } = useCollection('transport_pricing_request', {
		expand: 'user,serviceProvider'
	});
	const [filteredData, setFilteredData] = useState([]);
	const [filteredColumns, setFilteredColumns] = useState([]);
	const [displayData, setDisplayData] = useState([]);
	const { user } = useAuth();

	const handleStatusUpdate = async (id, status = 'Pending') => {
		try {
			switch (user?.role) {
				case 'Root':
					await updateItem(id, {
						status: status,
						golVerified: true,
						golVerifiedBy: user?.id
					});
					toast.success('Updated');
					break;
				case 'Merchant':
					await updateItem(id, {
						status: status,
						merchantVerified: true,
						merchantVerifiedBy: user?.id
					});
					toast.success('Updated');
					break;
				default:
					break;
			}
		} catch (error) {
			console.log(error)
			toast.error(error.message);
		} finally {
			mutation()
		}
	}

	const columns = [
		{
			id: 'User',
			accessorKey: 'expand.user.username',
			header: 'User',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.user?.username}</div>,
		},
		{
			id: 'serviceProvider',
			accessorKey: 'expand.serviceProvider.title',
			header: 'Service Provider',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.serviceProvider?.title}</div>,
		},
		{
			id: 'startDate',
			accessorKey: 'startDate',
			header: 'Start Date',
			filterable: true,
			cell: ({ row }) => <div>
				{
					new Date(row.original.startDate).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})
				}
			</div>,
		},
		{
			id: 'startLocation',
			accessorKey: 'startLocation',
			header: 'Start Location',
			filterable: true,
			cell: ({ row }) => <div>{row.original.startLocation}</div>,
		},
		{
			id: 'endLocation',
			accessorKey: 'endLocation',
			header: 'End Location',
			filterable: true,
			cell: ({ row }) => <div>{row.original.endLocation}</div>,
		},
		{
			id: 'specialRequest',
			accessorKey: 'specialRequest',
			header: 'Special Request',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.specialRequest}</div>,
		},
		{
			id: 'preferableRate',
			accessorKey: 'preferableRate',
			header: 'Preferable Rate',
			filterable: true,
			cell: ({ row }) => <div> Rs. {row.original?.preferableRate?.toLocaleString()} </div>,
		},
		{
			id: 'containersPerMonth',
			accessorKey: 'containersPerMonth',
			header: 'Containers Per Month',
			filterable: true,
			cell: ({ row }) => <div> {row.original?.containersPerMonth?.toLocaleString()} </div>,
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: 'Status',
			filterable: true,
			cell: ({ row }) => <div className={`${getStatusColor(row.original.status)} rounded-xl px-4 py-2 text-center`}>{row.original.status}</div>,
		},
		{
			id: 'reason',
			accessorKey: 'reason',
			header: 'Reason',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.reason}</div>,
		},
		{
			id: 'actions',
			accessorKey: 'actions',
			header: 'Actions',
			filterable: false,
			cell: ({ row }) => (
				<div className='flex gap-2 items-center'>
					<Eye
						size={18}
						className="cursor-pointer text-primary"
						onClick={() => console.log('View details for', row.original.id)}
					/>
					<EditForm info={row.original} />
					<Trash
						size={18}
						className="cursor-pointer text-primary"
						onClick={async () => {
							console.log('Delete details for', row.original.id);
							const confirmation = confirm('Are you sure you want to delete this entry?');
							if (confirmation) {
								await deleteItem(row.original.id);
							}
						}}
					/>
					{
						(user?.role === 'Root') && (
							<>
								<CircleCheckBig
									size={18}
									className="cursor-pointer text-primary"
									onClick={() => handleStatusUpdate(
										row.original.id,
										'Accepted'
									)}
								/>
								<RejectForm info={row.original} />
							</>
						)
					}
				</div>
			),
		}
	];

	const getStatusColor = (status) => {
		switch (status) {
			case 'Accepted':
				return 'bg-green-100 text-green-800';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	useEffect(() => {
		if (data?.length > 0 && user?.id) {
			let filtered_data = [];
			let filtered_cols = [];
			switch (user?.role) {
				case 'Customer':
					filtered_data = data.filter((item) => item?.user === user?.id);
					filtered_cols = columns.filter((item) => item?.id !== 'User')
					break;
				case 'Root':
					filtered_data = data;
					filtered_cols = columns;
					break;
				default:
					break;
			}
			setFilteredData(filtered_data);
			setFilteredColumns(filtered_cols);
			setDisplayData(filtered_data);
		}
	}, [data, user]);


	return (
		<>
			<Stats original={filteredData} requests={displayData} setRequests={setDisplayData} />
			<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-4">
				<h1 className="text-xl font-semibold p-4">Requests List</h1>
				{
					useIsMobile() ? (
						<MobileDataTable
							columns={filteredColumns}
							data={displayData}
						/>
					) : (
						<DataTable
							columns={filteredColumns}
							data={displayData}
							displayFilters={true}
						/>
					)
				}
			</div>
		</>
	);
}


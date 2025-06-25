import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection'
import { CircleX, Download, Eye, MapPinned, MapPlus, MoveRight, Trash } from 'lucide-react'
import Form from './Form';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Stats from './Stats'
import { toast } from 'sonner';

export default function TransportOrderMovements3PL() {
	const { data, updateItem, mutation, deleteItem, } = useCollection('3pl_transport_movement', {
		expand: 'order,order.provider,vehicle',
	});
	const { user } = useAuth();
	const [filteredData, setFilteredData] = useState([]);
	const [displayData, setDisplayData] = useState([]);

	const handleStatusUpdate = async (id, status = 'Cancelled') => {
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

	const redirectLink = (id) => {
		switch (user?.role) {
			case 'Merchant':
				return `/client/3pl/transport/services/order-movements/view-page/${id}`
			case 'Customer':
				return `/customer/3pl/transport/services/order-movements/view-page/${id}`
			case 'Root':
				return `/gol/3pl/transport/services/order-movements/view-page/${id}`
			default:
				return ''
		}
	}

	const updateLocation = (id) => {
		switch (user?.role) {
			case 'Merchant':
				return `/client/transport-order-movement-3pl/edit/${id}`
			case 'Customer':
				return `/customer/transport-order-movement-3pl/edit/${id}`
			case 'Root':
				return `/gol/transport-order-movement-3pl/edit/${id}`
			default:
				return ''
		}
	}

	const trackLocation = (id) => {
		switch (user?.role) {
			case 'Merchant':
				return `/client/3pl/services/transport/order-movements/view/${id}`
			case 'Customer':
				return `/customer/3pl/services/transport/order-movements/view/${id}`
			case 'Root':
				return `/gol/3pl/services/transport/order-movements/view/${id}`
			default:
				return ''
		}
	}

	const columns = [
		{
			id: 'id',
			accessorKey: 'order',
			header: 'Order No',
			filterable: true,
			cell: ({ row }) => <div>{row.original.order}</div>,
		},
		{
			id: 'jobOrder',
			accessorKey: 'jobOrder',
			header: 'Job Order',
			filterable: true,
			cell: ({ row }) => <div>{row.original.jobOrder}</div>,
		},
		{
			id: 'vehicleNo',
			accessorKey: 'vehicleNo',
			header: 'Vehicle No',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.vehicle?.vehicleNo}</div>,
		},
		{
			id: 'name',
			accessorKey: 'driver.name',
			header: 'Driver Name',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.driver?.name}</div>,
		},
		{
			id: 'contact',
			accessorKey: 'driver.contact',
			header: 'Driver Contact',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.driver?.contact}</div>,
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
			id: 'endDate',
			accessorKey: 'endDate',
			header: 'End Date',
			filterable: true,
			cell: ({ row }) => {
				const date = new Date(row.original?.endDate).toLocaleDateString('en-US', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				});
				return (
					<div>
						{date !== 'Invalid Date' ? date : 'Not Yet Delivered'}
					</div>
				)
			},
		},
		{
			id: 'route',
			accessorKey: 'route',
			header: 'Route',
			filterable: false,
			cell: ({ row }) => (
				<div className='flex items-center gap-x-1'>
					<p>{row.original?.expand?.order?.startLocation}</p>
					<MoveRight />
					<p>{row.original?.expand?.order?.endLocation}</p>
				</div>
			),
		},
		{
			id: 'remarks',
			accessorKey: 'remarks',
			header: 'Remarks',
			filterable: true,
			cell: ({ row }) => <div>{row.original.remarks}</div>,
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: 'Status',
			filterable: true,
			cell: ({ row }) => <div className={`${getStatusColor(row.original.status)} rounded-xl px-4 py-2 text-center`}>{row.original.status}</div>,
		},
		{
			id: 'actions',
			accessorKey: 'actions',
			header: 'Actions',
			filterable: false,
			cell: ({ row }) => (
				<div className='flex gap-2 items-center justify-center'>
					<Link
						href={redirectLink(row.original.id)}
					>
						<Eye
							size={18}
							className="cursor-pointer text-primary"
						/>
					</Link>
					<Link
						href={trackLocation(row.original.id)}
					>
						<MapPinned
							size={18}
							className="cursor-pointer text-primary"
						/>
					</Link>
					<Download
						size={18}
						className="cursor-pointer text-primary"
					/>
					{
						(user?.role === 'Merchant' || user?.role === 'Root') && (
							<>
								<Link
									href={updateLocation(row.original.id)}
								>
									<MapPlus
										size={18}
										className="cursor-pointer text-primary"
									/>
								</Link>
								<CircleX
									size={18}
									className="cursor-pointer text-primary"
									onClick={() => handleStatusUpdate(row.original.id)}
								/>
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
							</>
						)
					}
				</div>
			),
		}
	];

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

	useEffect(() => {
		if (data?.length > 0 && user?.id) {
			let filtered_data = [];
			switch (user?.role) {
				case 'Customer':
					filtered_data = data.filter((item) => item?.expand?.order?.customer === user?.id)
					break;
				case 'Merchant':
					filtered_data = data.filter((item) => item?.expand?.order?.expand?.provider?.author === user?.id)
					break;
				case 'Root':
					filtered_data = data;
					break;
				default:
					break;
			}
			setFilteredData(filtered_data);
			setDisplayData(filtered_data);
		}
	}, [data, user]);

	return (
		<>
			<Stats original={filteredData} detail={displayData} setDetail={setDisplayData} />
			<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
				{
					useIsMobile() ? (
						<>
							<h1 className="text-xl font-semibold p-4">Order Movements</h1>
							{
								(user?.role === 'Merchant' || user?.role === 'Root') && (
									<div className="flex justify-end p-4">
										<Form />
									</div>
								)
							}
							<MobileDataTable
								columns={columns}
								data={displayData}
							/>
						</>
					) : (
						<>
							<div className="flex items-center justify-between gap-4">
								<h1 className="text-lg font-semibold">Order Movements</h1>
								{
									(user?.role === 'Merchant' || user?.role === 'Root') && (
										<Form />
									)
								}
							</div>

							<DataTable
								columns={columns}
								data={displayData}
							/>
						</>
					)
				}
			</div>
		</>
	)
};

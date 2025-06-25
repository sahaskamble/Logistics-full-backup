import { CircleCheckBig, Download, Eye, Trash } from 'lucide-react';
import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection';
import Badge from '@/components/ui/Badge';
import Form from './Form';
import EditForm from './EditForm';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import Stats from './Stats';
import Link from 'next/link';
import RejectForm from './RejectForm';

export default function CFSOrderTable() {
	const { data, deleteItem, updateItem, mutation } = useCollection('cfs_orders', {
		expand: 'containers,cfs'
	});
	const { user } = useAuth();
	const [filteredData, setFilteredData] = useState([]);
	const [displayData, setDisplayData] = useState([]);

	const handleStatusUpdate = async (id, status = 'Pending') => {
		try {
			switch (user?.role) {
				case 'Root':
					await updateItem(id, {
						status: status,
						golVerified: true,
						golVerifiedBy: user?.id
					});
					toast.success('Updated the Order Status');
					break;
				case 'Merchant':
					await updateItem(id, {
						status: status,
						merchantVerified: true,
						merchantVerifiedBy: user?.id
					});
					toast.success('Updated the Order Status');
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
				return `/client/cfs/orders/view/${id}`
			case 'Customer':
				return `/customer/cfs/orders/view/${id}`
			case 'Root':
				return `/gol/cfs/orders/view/${id}`
			default:
				return ''
		}
	}

	const columns = [
		{
			id: 'id',
			accessorKey: 'id',
			header: 'Order ID',
			filterable: true,
			cell: ({ row }) => <div>{row.original.id}</div>,
		},
		{
			id: 'cfs',
			accessorKey: 'expand.cfs.title',
			header: 'CFS Provider',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.cfs?.title}</div>,
		},
		{
			id: 'igm',
			accessorKey: 'igmNo',
			header: 'IGM Number',
			filterable: true,
			cell: ({ row }) => <div>{row.original.igmNo}</div>,
		},
		{
			id: 'item',
			accessorKey: 'itemNo',
			header: 'Item Number',
			filterable: true,
			cell: ({ row }) => <div>{row.original.itemNo}</div>,
		},
		{
			id: 'bl',
			accessorKey: 'blNo',
			header: 'BL Number',
			filterable: true,
			cell: ({ row }) => <div>{row.original.blNo}</div>,
		},
		{
			id: 'container-no',
			accessorKey: 'containerNo',
			header: 'Containers',
			filterable: false,
			cell: ({ row }) => (
				<div className='grid grid-cols-2 gap-2 min-w-[200px]'>
					{
						row.original.expand.containers
							.slice(0, 5)
							.map((container, index) => (
								<Badge key={index} variant="secondary">
									{container.containerNo}
								</Badge>
							))
					}
					{row.original.expand.containers.length > 6 && '& so on'}
				</div>
			),
		},
		{
			id: 'consigneeName',
			accessorKey: 'consigneeName',
			header: 'Consignee Name',
			filterable: true,
			cell: ({ row }) => <div>{row.original.consigneeName}</div>,
		},
		{
			id: 'chaName',
			accessorKey: 'chaName',
			header: 'CHA Name',
			filterable: true,
			cell: ({ row }) => <div>{row.original.chaName}</div>,
		},
		// {
		// 	id: 'fromDate',
		// 	accessorKey: 'fromDate',
		// 	header: 'From Date',
		// 	filterable: true,
		// 	cell: ({ row }) => <div>
		// 		{
		// 			new Date(row.original?.fromDate).toLocaleDateString('en-US', {
		// 				day: 'numeric',
		// 				month: 'short',
		// 				year: 'numeric',
		// 			})
		// 		}
		// 	</div>,
		// },
		// {
		// 	id: 'toDate',
		// 	accessorKey: 'toDate',
		// 	header: 'To Date',
		// 	filterable: true,
		// 	cell: ({ row }) => <div>
		// 		{
		// 			new Date(row.original?.toDate).toLocaleDateString('en-US', {
		// 				day: 'numeric',
		// 				month: 'short',
		// 				year: 'numeric',
		// 			})
		// 		}
		// 	</div>,
		// },
		{
			id: 'orderDescription',
			accessorKey: 'orderDescription',
			header: 'Order Description',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.orderDescription}</div>,
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
				<div className='flex gap-2 items-center justify-center'>
					<Link
						href={redirectLink(row.original.id)}
					>
						<Eye
							size={18}
							className="cursor-pointer text-primary"
						/>
					</Link>
					<Download
						size={18}
						className="cursor-pointer text-primary"
					/>
					{
						(user?.role === 'Root' || user?.role === 'Merchant') && (
							<>
								<CircleCheckBig
									size={18}
									className="cursor-pointer text-primary"
									onClick={() => handleStatusUpdate(
										row.original.id,
										user?.role === 'Root' ? 'In Progress' : 'Accepted'
									)}
								/>
								<RejectForm info={row.original} />
							</>
						)
					}
					{
						(user?.role === 'Root' || user?.role === 'Customer') && (
							<>
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
			switch (user?.role) {
				case 'Customer':
					filtered_data = data.filter((item) => item?.customer === user?.id);
					break;
				case 'Merchant':
					filtered_data = data.filter((item) => item?.expand?.cfs?.author === user?.id && item?.golVerified);
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
			<Stats original={filteredData} orders={displayData} setOrders={setDisplayData} />
			<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-4">
				{
					useIsMobile() ? (
						<>
							<h1 className="text-xl font-semibold p-4">
								{user?.role === 'Customer' ? 'My Orders' : 'Customer Orders'}
							</h1>
							{
								user?.role === 'Customer' && (
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
								<h1 className="text-xl font-semibold p-4">
									{user?.role === 'Customer' ? 'My Orders' : 'Customer Orders'}
								</h1>
								{
									user?.role === 'Customer' && (
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

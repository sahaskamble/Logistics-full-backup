import { DataTable } from '@/components/ui/Table';
import { CircleCheckBig, Download, Eye, MessageCircleQuestion, Trash, } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import { useAuth } from '@/contexts/AuthContext';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import Stats from './Stats';
import Form from './Form';
import { toast } from 'sonner';
import Link from 'next/link';
import RejectForm from './RejectForm';

export default function ServiceRequests3PL({ serviceName = '', service = '' }) {
	const { data, updateItem, mutation, deleteItem } = useCollection('3pl_service_requests', {
		expand: 'user,order,order.provider,serviceType,service',
	});
	const [filteredData, setFilteredData] = useState([]);
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

	const redirectLink = (id) => {
		switch (user?.role) {
			case 'Merchant':
				return `/client/3pl/services/${service?.toLowerCase()}/requests/view/${id}`
			case 'Customer':
				return `/customer/3pl/services/${service?.toLowerCase()}/requests/view/${id}`
			case 'Root':
				return `/gol/3pl/services/${service?.toLowerCase()}/requests/view/${id}`
			default:
				return ''
		}
	}

	const columns = [
		{
			id: 'id',
			accessorKey: 'id',
			header: 'Request ID',
			filterable: true,
			cell: ({ row }) => <div>{row.original.id}</div>,
		},
		{
			id: 'order-no',
			accessorKey: 'order',
			header: 'Order ID',
			filterable: true,
			cell: ({ row }) => <div>{row.original.order}</div>,
		},
		{
			id: 'remarks',
			accessorKey: 'customerRemarks',
			header: 'Customer Remarks',
			filterable: true,
			cell: ({ row }) => <div>{row.original.customerRemarks}</div>,
		},
		{
			id: 'reason',
			accessorKey: 'reason',
			header: 'Reason',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.reason}</div>,
		},
		{
			id: 'serviceType',
			accessorKey: 'expand.serviceType.title',
			header: 'Service Type',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.serviceType?.title}</div>,
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
				<div className='flex gap-2 items-center'>
					<Link
						href={redirectLink(row.original.id)}
					>
						<Eye
							size={18}
							className="cursor-pointer text-primary"
							onClick={() => console.log('View details for', row.original.id)}
						/>
					</Link>
					<Download
						size={18}
						className="cursor-pointer text-primary"
					/>
					{
						(user?.role === 'Root' || user?.role === 'Customer') && (
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
						)
					}
					{
						(row.original.status === 'Rejected' && user?.role === 'Customer') && (
							<MessageCircleQuestion
								size={18}
								className="cursor-pointer text-[var(--primary)]"
							/>
						)
					}
					{
						(user?.role === 'Merchant') && (
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
					filtered_data = data.filter((item) =>
						item?.user === user?.id && item?.expand?.service?.title === service
					);
					serviceName !== ''
						? filtered_data = filtered_data.filter((item) =>
							item?.expand?.serviceType?.title === serviceName
						)
						: ''
					break;
				case 'Merchant':
					filtered_data = data.filter((item) =>
						item?.expand?.order?.expand?.provider?.author === user?.id
						&& item?.expand?.service?.title === service
					);
					serviceName !== '' ?
						filtered_data = filtered_data.filter((item) =>
							item?.expand?.serviceType?.title === serviceName
						) : ''
					break;
				case 'Root':
					filtered_data = data.filter((item) => item?.expand?.service?.title === service);
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
			<Stats original={filteredData} requests={displayData} setRequests={setDisplayData} />
			<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
				{
					useIsMobile() ? (
						<>
							<h1 className="text-xl font-semibold p-4">{serviceName} Requests List</h1>
							{
								user?.role === 'Customer' && (
									<div className="flex justify-end p-4">
										<Form service={service} />
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
								<h1 className="text-xl font-semibold p-4">{serviceName} Requests List</h1>
								{
									user?.role === 'Customer' && (
										<Form service={service} />
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
	);
};

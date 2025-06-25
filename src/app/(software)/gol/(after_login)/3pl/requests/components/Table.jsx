import { DataTable } from '@/components/ui/Table';
import { Eye, Trash, CircleCheckBig, CircleX } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import EditForm from './EditForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useIsMobile } from '@/hooks/use-mobile';

export default function RequestTable() {
  const { data, deleteItem, updateItem, mutation } = useCollection('cfs_service_requests', {
    expand: 'user,order,serviceType'
  });
  const { user } = useAuth();

  const handleStatusUpdate = async (id, status = 'Pending') => {
    try {
      await updateItem(id, {
        status: status,
        golVerified: true,
        golVerifiedBy: user?.id
      });
      toast.success('Updated');
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      mutation()
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
      accessorKey: 'order.id',
      header: 'Order ID',
      filterable: true,
      cell: ({ row }) => <div>{row.original.order}</div>,
    },
    {
      id: 'remarks',
      accessorKey: 'remarks',
      header: 'Your Remarks',
      filterable: true,
      cell: ({ row }) => <div>{row.original.customerRemarks}</div>,
    },
    {
      id: 'reason',
      accessorKey: 'reason',
      header: 'Reason',
      filterable: true,
      cell: ({ row }) => <div>{row.original.clientReason}</div>,
    },
    {
      id: 'serviceType',
      accessorKey: 'serviceType',
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
          <Eye
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => console.log('View details for', row.original.id)}
          />
          <CircleCheckBig
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => handleStatusUpdate(row.original.id, 'In Progress')}
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

  return (
    <div>
      <div className="border-2 md:bg-accent md:p-4 rounded-xl md:mt-8">
        <h1 className="text-xl font-semibold md:p-0 p-4">Requests List</h1>
        {
          useIsMobile() ? (
            <MobileDataTable
              columns={columns}
              data={data}
            />
          ) : (
            <DataTable
              columns={columns}
              data={data}
            />
          )
        }
      </div>
    </div>
  );
};

import { CircleCheckBig, CircleX, Download, Eye, Trash } from 'lucide-react';
import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection';
import Badge from '@/components/ui/Badge';
import Form from './Form';
import EditForm from './EditForm';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { toast } from 'sonner';

export default function RequestList() {
  const { data, deleteItem, updateItem, mutation } = useCollection('cfs_orders', {
    expand: 'containers,cfs'
  });
  const { user } = useAuth();

  const handleStatusUpdate = async (id, status = 'Pending') => {
    try {
      await updateItem(id, {
        status: status,
        golVerified: true,
        golVerifiedBy: user.id
      });
      toast.success('Created a new order');
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
      header: 'Order ID',
      filterable: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      id: 'cfs',
      accessorKey: 'cfs',
      header: 'CFS Provider',
      filterable: true,
      cell: ({ row }) => <div>{row.original.expand.cfs.title}</div>,
    },
    {
      id: 'igm',
      accessorKey: 'igm',
      header: 'IGM Number',
      filterable: true,
      cell: ({ row }) => <div>{row.original.igmNo}</div>,
    },
    {
      id: 'bl',
      accessorKey: 'bl',
      header: 'BL Number',
      filterable: true,
      cell: ({ row }) => <div>{row.original.blNo}</div>,
    },
    {
      id: 'boe',
      accessorKey: 'boe',
      header: 'BOE Number',
      filterable: true,
      cell: ({ row }) => <div>{row.original.boeNo}</div>,
    },
    {
      id: 'container-no',
      accessorKey: 'containerNo',
      header: 'Containers',
      filterable: true,
      cell: ({ row }) => (
        <div className='grid grid-cols-2 gap-2'>
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
    {
      id: 'fromDate',
      accessorKey: 'fromDate',
      header: 'From Date',
      filterable: true,
      cell: ({ row }) => <div>
        {
          new Date(row.original.fromDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }
      </div>,
    },
    {
      id: 'toDate',
      accessorKey: 'toDate',
      header: 'To Date',
      filterable: true,
      cell: ({ row }) => <div>
        {
          new Date(row.original.toDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }
      </div>,
    },
    {
      id: 'orderDescription',
      accessorKey: 'orderDescription',
      header: 'Order Description',
      filterable: true,
      cell: ({ row }) => <div>{row.original.orderDescription}</div>,
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
          <Eye
            size={18}
            className="cursor-pointer text-primary"
          />
          <Download
            size={18}
            className="cursor-pointer text-primary"
          />
          <CircleCheckBig
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => handleStatusUpdate(row.original.id, row.original.status)}
          />
          <CircleX
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => handleStatusUpdate(row.original.id, 'Rejected')}
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
    <div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
      <h1 className="text-xl font-semibold md:p-0 p-4">Customer Orders</h1>
      {
        useIsMobile() ? (
          <MobileDataTable
            columns={columns}
            data={data?.length > 0 ? data : []}
          />
        ) : (
          <DataTable
            columns={columns}
            data={data}
          />
        )
      }
    </div>
  )
};

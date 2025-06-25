import { CircleCheckBig, CircleX, Download, Eye, } from 'lucide-react';
import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function OrdersList() {
  const { data, updateItem, mutation } = useCollection('warehouse_orders', {
    expand: 'containers,provider',
    filter: `golVerified=true`
  });
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);

  const handleStatusUpdate = async (id, status = 'Pending') => {
    try {
      await updateItem(id, {
        status: status,
        merchantVerified: true,
        merchantVerifiedBy: user.id
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
      id: 'provider',
      accessorKey: 'provider',
      header: 'Provider',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand.provider.title}</div>,
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
            onClick={() => handleStatusUpdate(row.original.id, 'Accepted')}
          />
          <CircleX
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => handleStatusUpdate(row.original.id, 'Rejected')}
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

  useEffect(() => {
    if (data?.length > 0 && user?.id) {
      data.map((item) => {
        console.log('Author', item?.expand?.provider?.author);
        console.log('User', user?.name)

      })
      const filtered_data = data.filter((item) => item?.expand?.provider?.author === user?.id);
      setFilteredData(filtered_data);
    }
  }, [data]);

  return (
    <div className="border-2 md:bg-accent md:p-4 rounded-xl md:mt-8">
      <h1 className="text-xl font-semibold md:p-0 p-4">Customer Orders</h1>
      {
        useIsMobile() ? (
          <MobileDataTable
            columns={columns}
            data={filteredData}
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
          />
        )
      }
    </div>
  )
};

import { DataTable } from '@/components/ui/Table';
import { Eye, Download, CircleCheckBig, CircleX } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useEffect, useState } from 'react';

export default function RequestTable() {
  const { data, updateItem, mutation } = useCollection('warehouse_tariffs_request', {
    expand: 'order,order.provider,jobOrder,container,type'
  });
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);

  const handleStatusUpdate = async (id, status = 'Pending') => {
    try {
      await updateItem(id, {
        status: status,
        merchantVerified: true,
        merchantVerifiedBy: user?.id
      });
      toast.success('Updated');
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      mutation()
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border border-green-500';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-500';
      default:
        return 'bg-gray-300 text-gray-800 border border-gray-800';
    }
  };

  const columns = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Entry ID',
      filterable: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      id: 'Order ID',
      accessorKey: 'order',
      header: 'Order No.',
      filterable: true,
      cell: ({ row }) => <div>{row.original.order}</div>,
    },
    {
      id: 'container',
      accessorKey: 'container',
      header: 'Container No.',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.container?.containerNo}</div>,
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.type}</div>,
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
      cell: ({ row }) => (
        <div className={`px-2 py-1 text-xs rounded-full ${getStatusClass(row.original.status)}`}>
          {row.original.status}
        </div>
      ),
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
            onClick={() => handleStatusUpdate(row.original.id, 'Accepted')}
          />
          <CircleX
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => handleStatusUpdate(row.original.id, 'Rejected')}
          />
          <Download
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => console.log('Download files for', row.original.id)}
          />
        </div>
      ),
    }
  ];

  useEffect(() => {
    if (data?.length > 0 && user?.id) {
      const filtered_data = data.filter((item) => item?.expand?.order?.expand?.provider?.author === user?.id);
      setFilteredData(filtered_data);
    }
  }, [data]);

  return (
    <div>
      <div className="border-2 md:bg-accent md:p-4 rounded-xl md:mt-8">
        <h1 className="text-xl font-semibold md:p-0 p-4">Requests List</h1>
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
    </div>
  );
};

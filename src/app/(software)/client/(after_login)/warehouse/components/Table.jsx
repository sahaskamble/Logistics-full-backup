import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/Table';
import { Eye, Download, Trash } from 'lucide-react';
import Form from './Form';
import { useCollection } from '@/hooks/useCollection';
import EditForm from './EditForm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useAuth } from '@/contexts/AuthContext';

const Table = ({ serviceName = '' }) => {
  const { data, deleteItem } = useCollection('warehouse_service_details', {
    expand: 'order,order.provider,jobOrder,container,type'
  });
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
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
      id: 'Job Order ID',
      accessorKey: 'jobOrder',
      header: 'Job Order No.',
      filterable: true,
      cell: ({ row }) => <div>{row.original.jobOrder}</div>,
    },
    {
      id: 'container',
      accessorKey: 'container',
      header: 'Container No.',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.container?.containerNo}</div>,
    },
    {
      id: 'serviceType',
      accessorKey: 'serviceType',
      header: 'Service',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.type?.title}</div>,
    },
    {
      id: 'agent',
      accessorKey: 'agent',
      header: 'Agent / Supervisor',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.agent}</div>,
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
      id: 'receiptNo',
      accessorKey: 'receiptNo',
      header: 'Receipt No.',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.receiptNo}</div>,
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
    if (data?.length > 0) {
      setFilteredData(data.filter((item) => item?.expand?.type?.title === serviceName && item?.expand?.order?.expand?.provider?.author === user?.id))
    }
  }, [data]);


  return (
    <div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
      {
        useIsMobile() ? (
          <>
            <h1 className="text-xl font-semibold p-4">{serviceName} List</h1>
            <div className="flex justify-end p-4">
              <Form serviceName={serviceName} />
            </div>
            <MobileDataTable
              columns={columns}
              data={filteredData}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-lg font-semibold">{serviceName} List</h1>
              <Form serviceName={serviceName} />
            </div>
            <DataTable
              columns={columns}
              data={filteredData}
            />
          </>
        )
      }
    </div>
  );
};

export default Table;

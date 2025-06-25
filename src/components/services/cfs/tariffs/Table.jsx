import { DataTable } from '@/components/ui/Table';
import { Eye, Download, Trash, CircleCheckBig, CircleX } from 'lucide-react';
import Form from './Form';
import { useCollection } from '@/hooks/useCollection';
import EditForm from './EditForm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Stats from './ReqStats';
import { toast } from 'sonner';
import RejectForm from './RejectForm';

export default function RequestTable() {
  const { data, updateItem, mutation, deleteItem, } = useCollection('cfs_tariffs_request', {
    expand: 'order,order.cfs,jobOrder,container,type'
  });
  const { user } = useAuth();
  const [displayData, setDisplayData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
    // {
    //   id: 'container',
    //   accessorKey: 'expand.container.containerNo',
    //   header: 'Container No.',
    //   filterable: true,
    //   cell: ({ row }) => <div>{row.original?.expand?.container?.containerNo}</div>,
    // },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.type}</div>,
    },
    // {
    //   id: 'fromDate',
    //   accessorKey: 'fromDate',
    //   header: 'From Date',
    //   filterable: true,
    //   cell: ({ row }) => <div>
    //     {
    //       new Date(row.original.fromDate).toLocaleDateString('en-US', {
    //         day: 'numeric',
    //         month: 'short',
    //         year: 'numeric',
    //       })
    //     }
    //   </div>,
    // },
    // {
    //   id: 'toDate',
    //   accessorKey: 'toDate',
    //   header: 'To Date',
    //   filterable: true,
    //   cell: ({ row }) => <div>
    //     {
    //       new Date(row.original.toDate).toLocaleDateString('en-US', {
    //         day: 'numeric',
    //         month: 'short',
    //         year: 'numeric',
    //       })
    //     }
    //   </div>,
    // },
    {
      id: 'remarks',
      accessorKey: 'remarks',
      header: 'Remarks',
      filterable: true,
      cell: ({ row }) => <div>{row.original.remarks}</div>,
    },
    {
      id: 'reason',
      accessorKey: 'reason',
      header: 'Reason',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.reason}</div>,
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
          <Download
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => console.log('Download files for', row.original.id)}
          />
          {
            (user?.role === 'Root' || user?.role === 'Customer') && (
              <>
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
              </>
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

  useEffect(() => {
    if (data?.length > 0 && user?.id) {
      let filtered_data = [];
      switch (user?.role) {
        case 'Customer':
          filtered_data = data.filter((item) => item?.expand?.order?.customer === user?.id)
          break;
        case 'Merchant':
          filtered_data = data.filter((item) => item?.expand?.order?.expand?.cfs?.author === user?.id)
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
      <Stats original={filteredData} requests={displayData} setRequests={setDisplayData} />
      <div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
        {
          useIsMobile() ? (
            <>
              <h1 className="text-xl font-semibold p-4">Requests List</h1>
              {user?.role === 'Customer' && (
                <div className="flex justify-end p-4">
                  <Form />
                </div>
              )}
              <MobileDataTable
                columns={columns}
                data={displayData}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold">Requests List</h1>
                {user?.role === 'Customer' && (
                  <Form />
                )}
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


import React, { useState } from 'react';
import { Search, Package } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function MobileTable({ orders = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = orders.filter(request => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.containerNo && request.containerNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.IGMNo && request.IGMNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.BLNo && request.BLNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.BOENo && request.BOENo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });


  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-8 flex items-center justify-between">
          <div className="relative flex-1 mr-2">
            <Input
              type="text"
              placeholder="Search by Request ID"
              className="pl-8 w-full bg-[var(--accent)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="px-4 pb-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? 'No orders match your search' : 'No orders found'}</p>
            </div>
          ) : (
            filteredRequests.map((request, index) => (
              <div key={request.id || index} className="bg-[var(--accent)] rounded-lg p-3 mb-3 shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-blue-600">#{request.id}</div>
                  <div className='flex gap-2 items-center'>
                    <span className={`text-xs px-2 py-1 rounded-md ${getStatusBadgeClass(request.status)}`}>
                      {request.status || 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">IGM:</span> {request.IGMNo || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">BL:</span> {request.BLNo || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">BOE:</span> {request.BOENo || 'N/A'}
                  </p>
                  {request.cfs?.title && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">CFS:</span> {request.cfs.title}
                    </p>
                  )}
                  {request.updatedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Updated: {request.updatedAt}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}


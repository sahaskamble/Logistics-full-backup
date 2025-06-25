'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCollection } from '@/hooks/useCollection';
import pbclient from '@/lib/db';
import { useSidebar } from '@/contexts/SidebarProvider';
// import { toast } from 'sonner';

export default function ServiceRequestViewDetailsPage() {
  const { requestId } = useParams();
  const { setTitle } = useSidebar()
  const { data: requests, isLoading } = useCollection('cfs_service_requests', {
    expand: 'order,order.cfs,serviceType,merchantVerifiedBy,golVerifiedBy,user',
    filter: `id="${requestId}"`,
  });

  const request = requests?.[0];
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Service Request Details`)

    if (request?.files?.length > 0) {
      const imageUrls = request.files.map((file) => pbclient.files.getURL(request, file));
      setImages(imageUrls);
    } else {
      setImages([]);
    }
  }, [request]);

  if (isLoading)
    return <div className="p-8 text-[color:var(--secondary)] text-center">Loading request details...</div>;

  if (!request)
    return <div className="p-8 text-red-600 text-center">Request not found.</div>;

  return (
    <div className="max-w-container mx-auto px-6 py-10 space-y-8 bg-[color:var(--accent)] rounded-lg shadow-lg">
      <header className="border-b border-[color:var(--secondary)] pb-4 mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Service Request Details</h1>
        <p className="text-sm text-[color:var(--secondary)]">
          Request ID: <span className="font-mono text-[color:var(--primary)]">{request.id}</span>
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard label="Status" value={request.status} status color="primary" />
        <DetailCard label="Service Type" value={request.expand?.serviceType?.title || 'N/A'} />
        <DetailCard label="Customer Remarks" value={request.customerRemarks} full />
        <DetailCard label="Client Reason" value={request.clientReason} full />
        <DetailCard label="Submitted By" value={request.expand?.user?.name || 'N/A'} />
        <DetailCard label="Created" value={new Date(request.created).toLocaleString()} />
        <DetailCard label="Updated" value={new Date(request.updated).toLocaleString()} />
        <DetailCard label="Merchant Verified" value={request.merchantVerified ? 'Yes' : 'No'} />
        <DetailCard label="Merchant Verified By" value={request.expand?.merchantVerifiedBy?.name || 'N/A'} />
        <DetailCard label="GOL Verified" value={request.golVerified ? 'Yes' : 'No'} />
        <DetailCard label="GOL Verified By" value={request.expand?.golVerifiedBy?.name || 'N/A'} />
      </section>

      {/* Order Info */}
      {request.expand?.order && (
        <section>
          <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Related Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailCard label="IGM No" value={request.expand.order.igmNo} />
            <DetailCard label="BL No" value={request.expand.order.blNo} />
            <DetailCard label="BOE No" value={request.expand.order.boeNo} />
            <DetailCard label="Consignee" value={request.expand.order.consigneeName} />
          </div>
        </section>
      )}

      {/* CFS Info */}
      {request.expand?.order?.expand?.cfs && (
        <section>
          <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">CFS Info</h2>
          <div className="bg-[color:var(--background-2)] p-5 rounded-md border border-[color:var(--primary)] space-y-2">
            <DetailCard label="Title" value={request.expand.order.expand.cfs.title} />
            <DetailCard label="Location" value={request.expand.order.expand.cfs.location} />
            <DetailCard label="Contact" value={request.expand.order.expand.cfs.contact} />
          </div>
        </section>
      )}

      {/* Images */}
      {images.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Attached Files</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md border border-[color:var(--primary)]"
              >
                <img
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="h-40 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute bottom-0 w-full bg-[color:var(--background-2)] text-[color:var(--foreground)] text-sm text-center py-1">
                  File {index + 1}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Reusable DetailCard component
function DetailCard({ label, value, full = false, color = 'foreground', status = false }) {
  if (!value) return null;

  const colorMap = {
    foreground: 'text-[color:var(--foreground)]',
    primary: 'text-[color:var(--primary)]',
    secondary: 'text-[color:var(--secondary)]',
  };

  return (
    <div className={`space-y-1 ${full ? 'col-span-1 md:col-span-2' : ''}`}>
      <p className="text-sm text-[color:var(--secondary)]">{label}</p>
      <p className={`text-base font-medium ${colorMap[color]}`}>
        <span className={`${status ? 'bg-[var(--primary)] text-accent px-2 py-1 rounded-lg' : ''}`}>{value}</span>
      </p>
    </div>
  );
}

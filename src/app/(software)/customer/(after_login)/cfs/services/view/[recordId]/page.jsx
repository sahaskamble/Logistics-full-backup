'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCollection } from '@/hooks/useCollection';
import pbclient from '@/lib/db';
import { useSidebar } from '@/contexts/SidebarProvider';
import DetailCard from './components/DetailsCard';

export default function DetailsPage() {
  const { recordId } = useParams();
  const { setTitle } = useSidebar();

  const { data: details, isLoading } = useCollection('cfs_service_details', {
    expand: 'order,jobOrder,container,type',
  });

  const [detail, setdetail] = useState({});

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (details?.length) {
      const service_detail = details?.find((item) => {
        return item?.id === recordId
      });
      console.log(service_detail)
      setdetail(service_detail)
    }
  }, [details])

  useEffect(() => {
    setTitle(`${detail?.expand?.type?.title} Details`);

    if (detail?.files?.length > 0) {
      const urls = detail.files.map((file) => pbclient.files.getURL(detail, file));
      setImages(urls);
    }
  }, [detail]);

  if (isLoading) return <div className="p-8 text-[color:var(--secondary)] text-center">Loading details...</div>;
  if (!detail) return <div className="p-8 text-red-600 text-center">{detail?.expand?.type?.title} Record not found.</div>;

  return (
    <div className="max-w-container mx-auto px-6 py-10 space-y-8 bg-[color:var(--accent)] rounded-lg shadow-lg">
      <header className="border-b border-[color:var(--secondary)] pb-4 mb-6 space-y-2">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{detail?.expand?.type?.title} Details</h1>
        <p className="text-sm text-[color:var(--secondary)]">
          Record ID: <span className="font-mono text-[color:var(--primary)]">{detail.id}</span>
        </p>
      </header>

      {/* Summary Details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard label="Receipt No" value={detail.receiptNo} />
        <DetailCard label="Agent" value={detail.agent} />
        <DetailCard label="Status" value={detail.status} status color="primary" />
        <DetailCard label="Date" value={new Date(detail.date).toLocaleDateString()} />
        <DetailCard label="Remarks" value={detail.remarks} full />
      </section>

      {/* Expanded Relations */}
      <section>
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Linked Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailCard label="Job Order ID" value={detail.expand?.jobOrder?.id || 'N/A'} />
          <DetailCard label="Order ID" value={detail.expand?.order?.id || 'N/A'} />
          <DetailCard label="Container No" value={detail.expand?.container?.containerNo || 'N/A'} />
          <DetailCard label="Container Size" value={detail.expand?.container?.size || 'N/A'} />
          <DetailCard label="Service Type" value={detail.expand?.type?.title || 'N/A'} />
        </div>
      </section>

      {/* Image Preview */}
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


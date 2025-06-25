'use client';

import React, { useEffect, useState } from 'react';
import { useCollection } from '@/hooks/useCollection';
import { useParams } from 'next/navigation';
import pbclient from '@/lib/db';
import DetailCard from './components/DetailsCard';

export default function OrderMovementViewDetailsPage() {
  const { orderId } = useParams();
  const { data: orders, isLoading } = useCollection('warehouse_order_movement', {
    expand: 'order,order.provider',
    filter: `id="${orderId}"`,
  });
  const [images, setImages] = useState([]);

  console.log("Orders Array", orders)

  useEffect(() => {
    if (orders && Array.isArray(orders) && orders.length > 0) {
      const order = orders?.[0];
      const imgUrls = order.files.map(imgs =>
        pbclient.files.getURL(order, imgs)
      );
      setImages(imgUrls);
    }
  }, [orders]);

  const order = orders?.[0];

  if (isLoading)
    return <div className="p-8 text-[color:var(--secondary)] text-center">Loading order details...</div>;
  if (!order)
    return <div className="p-8 text-red-600 text-center">Order not found.</div>;

  return (
    <div className="max-w-container mx-auto px-6 py-10 space-y-8 bg-[color:var(--accent)] rounded-lg shadow-lg">
      <header className="border-b border-[color:var(--secondary)] pb-4 mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Order Details</h1>
        <p className="text-sm text-[color:var(--secondary)]">
          Order ID: <span className="font-mono text-[color:var(--primary)]">{order.id}</span>
        </p>
      </header>

      {/* Order Movement Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard
          label="Movement Date"
          value={new Date(order.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        />
        <DetailCard label="Status" value={order.status} color="primary" status={true} />
        <DetailCard label="Remarks" value={order.remarks} full />
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Order Information</h2>
        {order.expand?.order ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailCard label="IGM No" value={order.expand.order.igmNo} />
            <DetailCard label="BL No" value={order.expand.order.blNo} />
            <DetailCard label="BOE No" value={order.expand.order.boeNo} />
            <DetailCard label="Consignee" value={order.expand.order.consigneeName} />
          </div>
        ) : (
          <p className="text-[color:var(--secondary)]">Order details unavailable.</p>
        )}
      </section>

      {/* provider Info */}
      <section>
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Provider Information</h2>
        {order.expand?.order?.expand?.provider ? (
          <div className="bg-[color:var(--background-2)] p-5 rounded-md shadow-sm border border-[color:var(--primary)] space-y-2">
            <DetailCard label="Title" value={order.expand.order.expand.provider.title} />
            <DetailCard label="Location" value={order.expand.order.expand.provider.location} />
            <DetailCard label="Contact" value={order.expand.order.expand.provider.contact} />
          </div>
        ) : (
          <p className="text-[color:var(--secondary)]">provider information not available.</p>
        )}
      </section>

      {/* Image Gallery Section */}
      {Array.isArray(images) && images.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Attached Files</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((fileUrl, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md border border-[color:var(--primary)]"
              >
                <img
                  src={fileUrl}
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


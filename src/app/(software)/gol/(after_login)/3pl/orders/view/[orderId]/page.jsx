'use client';

import React, { useEffect, useState } from 'react';
import { useCollection } from '@/hooks/useCollection';
import { useParams } from 'next/navigation';
import pbclient from '@/lib/db';
import { useSidebar } from '@/contexts/SidebarProvider';
import DetailCard from './components/DetailsCard';

export default function OrderViewDetailsPage() {
  const { orderId } = useParams();
  const { setTitle } = useSidebar();
  const { data: orders, isLoading } = useCollection('3pl_orders', {
    expand: 'containers,provider',
    filter: `id="${orderId}" && golVerified=true`,
  });
  const [images, setImages] = useState([]);

  console.log("Orders Array", orders)

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Order Details`)

    // confirming the Orders Array and setting up images Array
    if (orders && Array.isArray(orders) && orders.length > 0) {
      const order = orders?.[0];
      const imgUrls = order.files.map(imgs =>
        pbclient.files.getURL(order, imgs)
      );
      setImages(imgUrls);
    } else {
      console.log('Error getting Images from server');
    }
  }, [orders]);

  // Once again verifing The Orders Array is comming with single index
  const order = orders?.[0];

  // Loading State
  if (isLoading)
    return <div className="p-8 text-[color:var(--secondary)] text-center">Loading order details...</div>;
  if (!order)
    return <div className="p-8 text-red-600 text-center">Order not found.</div>;

  return (
    <div className="max-w-container mx-auto px-6 py-10 space-y-8 bg-[color:var(--accent)] rounded-lg shadow-lg">
      {/*
      <div>
        <AppBreadcrumb dashboard={'/client/dashboard'} />
      </div>
      */}
      <header className="border-b border-[color:var(--secondary)] pb-4 mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Order Details</h1>
        <p className="text-sm text-[color:var(--secondary)]">
          Order ID: <span className="font-mono text-[color:var(--primary)]">{order.id}</span>
        </p>
      </header>

      {/* Order Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard label="IGM No" value={order.igmNo} />
        <DetailCard label="BL No" value={order.blNo} />
        <DetailCard label="BOE No" value={order.boeNo} />
        <DetailCard label="Consignee Name" value={order.consigneeName} />
        <DetailCard label="CHA Name" value={order.chaName} />
        <DetailCard label="Status" value={order.status} color="primary" status={true} />
        <DetailCard label="Start Date" value={new Date(order.fromDate).toLocaleDateString('en-US', { day: "2-digit", month: "long", year: "numeric" })} />
        <DetailCard label="End Date" value={new Date(order.toDate).toLocaleDateString('en-US', { day: "2-digit", month: "long", year: "numeric" })} />
        <DetailCard label="Start Location" value={order.startLocation} />
        <DetailCard label="Destination" value={order.endLocation} />
        <DetailCard label="Special Request" value={order.specialRequest} />
        <DetailCard label="Vehicle Description" value={order.vehicleDescription} />
        <DetailCard label="Order Description" value={order.orderDescription} />
      </section>

      {/* provider Info */}
      <section>
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Provider Information</h2>
        {order.expand?.provider ? (
          <div className="bg-[color:var(--background-2)] p-5 rounded-md shadow-sm border border-[color:var(--primary)] space-y-2">
            <DetailCard label="Title" value={order.expand.provider.title} />
            <DetailCard label="Location" value={order.expand.provider.location} />
            <DetailCard label="Contact" value={order.expand.provider.contact} />
          </div>
        ) : (
          <p className="text-[color:var(--secondary)]">No provider information available.</p>
        )}
      </section>

      {/* Containers */}
      <section>
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)] mb-4">Containers</h2>
        {Array.isArray(order.expand?.containers) && order.expand.containers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {order.expand.containers.map((container) => (
              <div
                key={container.id}
                className="border border-[color:var(--primary)] p-4 rounded-lg shadow-sm bg-white hover:bg-[color:var(--accent)] transition"
              >
                <p className="font-semibold text-[color:var(--foreground)]">
                  Container No: <span className="text-[color:var(--light-primary)]">{container.containerNo}</span>
                </p>
                <p className="text-sm text-[color:var(--secondary)]">Size: {container.size}</p>
                <p className="text-sm text-[color:var(--secondary)]">Status: {container.status}</p>
                <p className="text-sm text-[color:var(--secondary)]">Cargo Type: {container.cargoType}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[color:var(--secondary)]">No container data found.</p>
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


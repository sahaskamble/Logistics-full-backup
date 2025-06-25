'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCollection } from '@/hooks/useCollection';
import { useSidebar } from '@/contexts/SidebarProvider';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DetailsCard from './components/DetailsCard';
import Button from '@/components/ui/Button';
import { Send } from 'lucide-react';

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const currentIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684890.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  className: 'leaflet-current-icon',
});

const endIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/942/942748.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
};

async function geocodeLocation(locationName) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }
  return null;
}

export default function DeliveryViewDetailsPage() {
  const { recordId } = useParams();
  const { setTitle } = useSidebar();
  const { data: order_movement, isLoading } = useCollection('transport_order_movement', {
    expand: 'order,order.provider,jobOrder,vehicle',
    filter: `id="${recordId}"`,
  });

  const [startLocation, setStartLocation] = useState({ latitude: 0, longitude: 0, address: '' });
  const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
  const [endLocation, setEndLocation] = useState({ latitude: 0, longitude: 0, address: '' });

  const detail = order_movement?.[0];

  useEffect(() => {
    setTitle('Track Order');

    const fetchData = async () => {
      setStartLocation({ ...startLocation, address: detail.expand?.order?.startLocation || '' });
      setEndLocation({ ...endLocation, address: detail.expand?.order?.endLocation || '' });

      const start = (detail?.startLocation?.lat === 0 && detail?.startLocation?.lon === 0)
        ? detail.expand?.order?.startLocation
        : detail?.startLocation;

      const end = (detail?.endLocation?.lat === 0 && detail?.endLocation?.lon === 0)
        ? detail.expand?.order?.endLocation
        : detail.endLocation

      const current = detail.currentLocation;

      if (start?.lat && start?.lon) {
        setStartLocation({ ...startLocation, latitude: start.lat, longitude: start.lon });
      } else {
        const geo = await geocodeLocation(start);
        if (geo) setStartLocation({ ...startLocation, latitude: geo.lat, longitude: geo.lon });
      }

      if (current?.lat && current?.lon) {
        setCurrentLocation({ latitude: current.lat, longitude: current.lon });
      }

      if (end?.lat && end?.lon) {
        setEndLocation({ ...endLocation, latitude: end.lat, longitude: end.lon });
      } else {
        const geo = await geocodeLocation(end);
        if (geo) setEndLocation({ ...endLocation, latitude: geo.lat, longitude: geo.lon });
      }
    }

    if (detail) {
      fetchData();
    }
  }, [detail]);

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/${startLocation.latitude},${startLocation.longitude}/${endLocation.latitude},${endLocation.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (isLoading)
    return <div className="p-8 text-[color:var(--secondary)] text-center">Loading request details...</div>;
  if (!detail)
    return <div className="p-8 text-red-600 text-center">Movement not found.</div>;

  return (
    <div className="p-4 border rounded-xl min-h-[85dvh] flex flex-col items-center justify-center">
      {
        detail?.status !== 'Not Started' ? (
          <>
            <MapContainer
              center={[currentLocation.latitude, currentLocation.longitude]}
              zoom={7}
              scrollWheelZoom={true}
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[startLocation.latitude, startLocation.longitude]} icon={startIcon}>
                <Popup>
                  <div>
                    <h1 className='font-bold'>Start Location </h1>
                    <p>{startLocation?.address}</p>
                  </div>
                </Popup>
              </Marker>

              <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={currentIcon}>
                <Popup>
                  <div>
                    <h1 className='font-bold'>Current Location</h1>
                  </div>
                </Popup>
              </Marker>

              <Marker position={[endLocation.latitude, endLocation.longitude]} icon={endIcon}>
                <Popup>
                  <div>
                    <h1 className='font-bold'>End Location</h1>
                    <p>{endLocation?.address}</p>
                  </div>
                </Popup>
              </Marker>
              <RecenterMap position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }} />
            </MapContainer>
            <Button
              onClick={handleGetDirections}
              title={'View on Google Maps'}
              className='rounded-b-md w-full'
              iconPosition='right'
              icon={<Send className='ml-2' />}
            />
          </>
        ) : (
          <h1 className='flex items-center justify-center text-xl font-semibold pb-8'>Journey not started yet</h1>
        )
      }


      {/* Details Card */}
      <DetailsCard detail={detail} />
    </div>
  );
}

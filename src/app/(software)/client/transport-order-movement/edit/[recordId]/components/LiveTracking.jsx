'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader, Pause, Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import DetailsCard from './DetailsCard';

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

const center = {
	lat: 0,
	lng: 0,
};


const RecenterMap = ({ position }) => {
	const map = useMap();
	useEffect(() => {
		map.setView(position);
	}, [position, map]);
	return null;
};

const LiveTracking = ({
	start,
	destination,
	detail,
	updateStart = ({ lat, lng }) => { },
	updateCurrent = ({ lat, lng }) => { },
	closeRide = ({ lat, lng }) => { },
}) => {
	const [currentPosition, setCurrentPosition] = useState(center);
	const lastUpdateRef = useRef(Date.now());

	// For Continuous update on Location
	useEffect(() => {
		if (!navigator?.geolocation) {
			console.error("Geolocation is not supported by your browser.");
			return;
		}

		const updatePosition = (position) => {
			const { latitude, longitude } = position.coords;
			setCurrentPosition({ lat: latitude, lng: longitude });

			const now = Date.now();
			if (now - lastUpdateRef.current > 30000) { // 10 seconds
				updateCurrent({ lat: latitude, lng: longitude });
				lastUpdateRef.current = now;
			}
		};

		const handleError = (error) => {
			console.log("Geolocation error:", error.message, error);
		};

		const watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
			enableHighAccuracy: true,
			timeout: 1000,
			maximumAge: 0,
		});
		return () => navigator.geolocation.clearWatch(watchId);
	}, [updateCurrent]);

	const handleGetDirections = () => {
		if (destination?.latitude !== 0 && destination?.longitude !== 0) {
			const googleMapsUrl = `https://www.google.com/maps/dir/${currentPosition.lat},${currentPosition.lng}/${destination.latitude},${destination.longitude}`;
			window.open(googleMapsUrl, '_blank');
		} else {
			const googleMapsUrl = `https://www.google.com/maps/dir/${currentPosition.lat},${currentPosition.lng}`;
			window.open(googleMapsUrl, '_blank');
		}
	};

	// if (loading) {
	// 	return (
	// 		<div
	// 			style={{ width: '100%', height: '100dvh' }}
	// 			className='flex items-center justify-center'
	// 		>
	// 			<div className='animate-spin duration-1000'>
	// 				<Loader className='w-[100px] h-[100px]' />
	// 			</div>
	// 		</div>
	// 	)
	// }

	return (
		<>
			<div
				className='w-screen md:h-[60dvh] h-[50dvh]'
			>
				<MapContainer
					center={currentPosition}
					zoom={25}
					scrollWheelZoom={true}
					style={{ width: '100%', height: '100%' }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={[start.latitude, start.longitude]} icon={startIcon}>
						<Popup>
							<div>
								<h1 className='font-bold'>Start Location </h1>
								<p>{start?.address}</p>
							</div>
						</Popup>
					</Marker>

					<Marker position={currentPosition} icon={currentIcon}>
						<Popup>Current Location</Popup>
					</Marker>

					<Marker position={[destination.latitude, destination.longitude]} icon={endIcon}>
						<Popup>
							<div>
								<h1 className='font-bold'>End Location</h1>
								<p>{destination?.address}</p>
							</div>
						</Popup>
					</Marker>

					<RecenterMap position={currentPosition} />
				</MapContainer>
			</div>
			<div className='w-full grid items-center justify-center md:pt-6 p-4'>
				<Button
					className='rounded-t-xl pl-6 pr-6'
					textSize='md:text-lg text-sm'
					title={
						detail?.status === 'Not Started' ? 'Start Journey' : 'End Ride'
					}
					iconPosition='right'
					icon={
						detail?.status === 'Not Started' ? (
							<Play className='ml-4 md:w-6 md:h-6 w-4 h-4' />
						) : (
							<Pause className='ml-4 md:w-6 md:h-6 w-4 h-4' />
						)
					}
					onClick={() => detail?.status === 'Not Started' ?
						updateStart({
							lat: currentPosition.lat,
							lng: currentPosition.lng
						}) :
						closeRide({
							lat: currentPosition.lat,
							lng: currentPosition.lng
						})
					}
				/>
				{/* Details Card */}
				<DetailsCard detail={detail} />
			</div>
		</>
	);
}

export default LiveTracking;

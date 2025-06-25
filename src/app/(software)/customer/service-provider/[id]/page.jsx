'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, ChevronLeft, ChevronRight, ArrowLeft, Phone, Mail, Globe, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import RenderRatings from '@/components/ui/renderRatings';
import { useCollection } from '@/hooks/useCollection';
import { PB_URL } from '@/constants/url';
import { parseTagsFromResponse } from '@/app/(software)/client/(after_login)/profile/utils/tagUtils';
import { useAuth } from '@/contexts/AuthContext';
import LoginPopUp from '../../home/components/LoginPopUp';

export default function ServiceProviderDetailsPage() {
	const { id } = useParams();
	const router = useRouter();
	const { user } = useAuth();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showLoginPopup, setShowLoginPopup] = useState(false);

	const { data: providers } = useCollection('service_provider', {
		expand: 'service,author'
	});

	const provider = providers?.find(p => p.id === id);

	useEffect(() => {
		if (!provider && providers?.length > 0) {
			// Provider not found, redirect to home
			router.push('/customer/home');
		}
	}, [provider, providers, router]);

	const nextImage = () => {
		if (provider?.files?.length > 0) {
			setCurrentImageIndex((prev) => (prev + 1) % provider.files.length);
		}
	};

	const prevImage = () => {
		if (provider?.files?.length > 0) {
			setCurrentImageIndex((prev) => (prev - 1 + provider.files.length) % provider.files.length);
		}
	};

	const handleViewDetailsClick = () => {
		if (!user) {
			setShowLoginPopup(true);
		} else {
			// User is logged in, show detailed information or navigate to detailed view
			console.log('User is logged in, showing details for provider:', provider.id);
		}
	};

	const handleLoginPopupClose = () => {
		setShowLoginPopup(false);
	};

	if (!provider) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-4">Loading...</h2>
					<p className="text-gray-600">Please wait while we load the service provider details.</p>
				</div>
			</div>
		);
	}

	const images = provider.files || [];
	const tags = parseTagsFromResponse(provider.tags);
	const services = provider.expand?.service || [];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header with back button */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					>
						<ArrowLeft className="h-5 w-5" />
						<span>Back to Services</span>
					</button>
				</div>
			</div>

			{/* Main content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					{/* Image Gallery Section */}
					<div className="relative h-96 md:h-[500px]">
						{images.length > 0 ? (
							<>
								<Image
									src={`${PB_URL}/api/files/service_provider/${id}/${images[currentImageIndex]}`}
									alt={`${provider.title} - Image ${currentImageIndex + 1}`}
									fill
									className="object-cover"
								/>

								{/* Navigation arrows */}
								{images.length > 1 && (
									<>
										<button
											onClick={prevImage}
											className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
											aria-label="Previous image"
										>
											<ChevronLeft className="h-6 w-6" />
										</button>
										<button
											onClick={nextImage}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
											aria-label="Next image"
										>
											<ChevronRight className="h-6 w-6" />
										</button>
									</>
								)}

								{/* Image counter */}
								{images.length > 1 && (
									<div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
										{currentImageIndex + 1} / {images.length}
									</div>
								)}
							</>
						) : (
							<div className="w-full h-full bg-gray-200 flex items-center justify-center">
								<span className="text-gray-500 text-lg">No images available</span>
							</div>
						)}
					</div>

					{/* Thumbnail strip */}
					{images.length > 1 && (
						<div className="p-4 bg-gray-50 border-t">
							<div className="flex gap-2 overflow-x-auto">
								{images.map((image, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${index === currentImageIndex
											? 'ring-2 ring-green-500 ring-offset-2'
											: 'hover:opacity-80'
											}`}
									>
										<Image
											src={`${PB_URL}/api/files/service_provider/${id}/${image}`}
											alt={`Thumbnail ${index + 1}`}
											fill
											className="object-cover"
										/>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Provider Information */}
					<div className="p-6 md:p-8">
						<div className="grid md:grid-cols-2 gap-8">
							{/* Left column - Basic info */}
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-4">{provider.title}</h1>

								<div className="flex items-center text-gray-600 mb-4">
									<MapPin className="mr-2 w-5 h-5" />
									<span className="text-lg">{provider.location}</span>
								</div>

								<div className="flex items-center mb-6">
									<RenderRatings rating={provider?.rating?.toFixed(1) || '0.0'} />
									<span className="ml-2 text-lg text-gray-600">
										{provider?.rating?.toFixed(1) || '0.0'} rating
									</span>
								</div>

								{/* Tags */}
								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-3">Services</h3>
									<div className="flex flex-wrap gap-2">
										{tags && tags.length > 0 ? (
											tags.map((tag) => (
												<span
													key={tag}
													className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
												>
													{tag}
												</span>
											))
										) : (
											<span className="text-gray-500 text-sm italic">No services listed</span>
										)}
									</div>
								</div>

								{/* Description */}
								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-3">About</h3>
									<p className="text-gray-700 leading-relaxed">
										{provider.description || 'No description available.'}
									</p>
								</div>
							</div>

							{/* Right column - Contact & Actions */}
							<div>
								{/* Contact Information */}
								<div className="bg-gray-50 rounded-lg p-6 mb-6">
									<h3 className="text-lg font-semibold mb-4">Contact Information</h3>

									{provider.contact && (
										<div className="flex items-center mb-3">
											<Phone className="mr-3 w-5 h-5 text-gray-500" />
											<span className="text-gray-700">{provider.contact}</span>
										</div>
									)}

									{provider.expand?.author?.email && (
										<div className="flex items-center mb-3">
											<Mail className="mr-3 w-5 h-5 text-gray-500" />
											<span className="text-gray-700">{provider.expand?.author?.email}</span>
										</div>
									)}

									{provider.website && (
										<div className="flex items-center mb-3">
											<Globe className="mr-3 w-5 h-5 text-gray-500" />
											<a
												href={provider.website}
												target="_blank"
												rel="noopener noreferrer"
												className="text-green-600 hover:text-green-700 transition-colors"
											>
												Visit Website
											</a>
										</div>
									)}

									{provider.operating_hours && (
										<div className="flex items-center">
											<Clock className="mr-3 w-5 h-5 text-gray-500" />
											<span className="text-gray-700">{provider.operating_hours}</span>
										</div>
									)}
								</div>

								{/* Action Buttons */}
								<div className="space-y-3">
									{!user && (
										<Button
											title="View Full Details"
											onClick={handleViewDetailsClick}
											className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white"
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Login Popup */}
			{showLoginPopup && <LoginPopUp onOpen={handleLoginPopupClose} />}
		</div>
	);
}

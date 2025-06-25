'use client';

import { useEffect, useState } from "react";
import HeaderLayout from "./components/HeaderLayout";
import MobileHeaderLayout from "./components/MobileHeaderLayout";
import Button from "@/components/ui/Button";
import { SlidersHorizontalIcon, MapPin, ChevronLeft, ChevronRight, Search, } from 'lucide-react';
import Image from "next/image";
import { Dialog } from "@/components/ui/Dialog";
import { FilterCFS } from "./components/Filter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectItem } from "@/components/ui/Select";
import LoginPopUp from "./components/LoginPopUp";
import { useCollection } from "@/hooks/useCollection";
import RenderRatings from "@/components/ui/renderRatings";
import { PB_URL } from "@/constants/url";
import { RequestPopup } from "./components/RequestPopup";
import Footer from "@/app/components/footer/Footer";
import { parseTagsFromResponse } from '@/app/(software)/client/(after_login)/profile/utils/tagUtils';
import { useAuth } from '@/contexts/AuthContext';
import ContactGolPopup from './components/ContactGolPopup';
import { useRouter } from 'next/navigation';

export default function ClientHomePage() {
	const { user } = useAuth();
	const { data: providers } = useCollection('service_provider', {
		expand: 'service'
	});
	const [currentService, setCurrentService] = useState('CFS');
	const [filteredServices, setFilteredServices] = useState([]);
	const [filter, setFilter] = useState('');
	const [SearchQuery, setSearchQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isPopup, setIsPopup] = useState(false);
	const [showContactGolPopup, setShowContactGolPopup] = useState(false);

	useEffect(() => {
		if (providers?.length > 0) {
			setFilteredServices(providers.filter((provider) => {
				return provider?.expand?.service?.find((service) => service?.title === currentService)
			}));
		}
	}, [currentService, SearchQuery, providers]);

	// Smart popup logic
	useEffect(() => {
		const checkPopupDisplay = () => {
			const lastPopupTime = localStorage.getItem('lastPopupTime');
			const popupCount = parseInt(localStorage.getItem('popupCount') || '0');
			const now = Date.now();
			const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
			const threeDays = 3 * oneDay; // 3 days in milliseconds

			if (!user) {
				// User not logged in - show login popup
				if (!lastPopupTime || (now - parseInt(lastPopupTime)) > oneDay) {
					setIsPopup(true);
					localStorage.setItem('lastPopupTime', now.toString());
					localStorage.setItem('popupCount', (popupCount + 1).toString());
				}
			} else {
				// User is logged in - show contact GOL popup occasionally
				if (popupCount < 3) { // Show max 3 times
					if (!lastPopupTime || (now - parseInt(lastPopupTime)) > threeDays) {
						setShowContactGolPopup(true);
						localStorage.setItem('lastPopupTime', now.toString());
						localStorage.setItem('popupCount', (popupCount + 1).toString());
					}
				}
			}
		};

		// Delay popup display to avoid immediate popup on page load
		const timer = setTimeout(checkPopupDisplay, 2000);
		return () => clearTimeout(timer);
	}, [user]);


	const handlePopUpClose = () => {
		setIsPopup(false);
	};

	const handleContactGolPopupClose = () => {
		setShowContactGolPopup(false);
	};

	return (
		<section className={`w-full h-auto items-center justify-center`}>
			{/* -- Services List -- */}
			{
				useIsMobile() ?
					<MobileHeaderLayout currentService={currentService} setCurrentService={setCurrentService} user={user} />
					:
					<HeaderLayout currentService={currentService} setCurrentService={setCurrentService} user={user} />
			}

			<section className="p-4">
				<div className="flex items-center justify-between">
					<h1 className="font-bold text-2xl">{currentService} Service Providers</h1>
					<Dialog
						trigger={<Button title={'Filters'} icon={<SlidersHorizontalIcon size={20} />} variant={''} iconPosition="right" className="rounded-md bg-[var(--primary)]" />}
						title="Filters"
						open={isOpen}
						onOpenChange={setIsOpen}
					>
						<FilterCFS openDialog={setIsOpen} />
					</Dialog>
				</div>

				{/* Search */}
				<div className="flex items-center justify-between gap-4 w-full mt-10">
					<div className="flex items-center justify-between gap-4 w-full">
						<div className="flex items-center justify-between relative gap-4 w-full">
							<Search className="absolute left-2 top-2 p-1 h-6 w-6 text-muted-foreground" />
							<input
								className={`flex pl-10 h-11 w-full bg-[var(--accent)] rounded-md border border-input text-[var(--foreground)] px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--foreground)] placeholder:text-[var(--secondary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
								placeholder={!useIsMobile() ? `Search ${currentService} Service Providers...` : 'Search'}
								value={SearchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Select value={filter} onValueChange={(value) => setFilter(value)} placeholder="-- Search By --" className='h-11'>
							<SelectItem value={'title'}> By Name </SelectItem>
							<SelectItem value={'location'}> By Location </SelectItem>
						</Select>
					</div>
				</div>

				{/* -- Providers List -- */}
				<div className="flex flex-col md:gap-10 gap-4 pt-6">
					{filteredServices.map((provider) => (
						<ServiceCard
							key={provider.id}
							title={provider.title}
							location={provider.location}
							rating={provider?.rating || 0}
							tags={parseTagsFromResponse(provider.tags)}
							description={provider.description}
							images={provider.files || []}
							id={provider.id}
							currentService={currentService}
						/>
					))}
				</div>
			</section>
			<Footer />
			{
				!user && isPopup && <LoginPopUp onOpen={handlePopUpClose} />
			}
			{
				user && showContactGolPopup && <ContactGolPopup onClose={handleContactGolPopupClose} />
			}
		</section >
	)
}

const ServiceCard = ({ title, location, rating, tags, description, images, id, currentService }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showLoginPopup, setShowLoginPopup] = useState(false);
	const { user } = useAuth();
	const router = useRouter();

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	};
	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const handleViewDetailsClick = () => {
		if (!user) {
			setShowLoginPopup(true);
		} else {
			router.push(`/customer/service-provider/${id}`);
		}
	};

	const handleLoginPopupClose = () => {
		setShowLoginPopup(false);
	};

	return (
		<div className="flex flex-col bg-[var(--accent)] md:flex-row rounded-lg shadow-md overflow-hidden border min-h-96 p-4 md:p-8 gap-10">
			{/* Left side - Image gallery with grid layout */}
			<div className="relative w-full md:w-2/5 h-80 md:h-96">
				{images?.length > 0 ? (
					<div className="flex gap-3 h-full">
						{/* Main large image */}
						<div className="relative flex-[2] rounded-xl overflow-hidden">
							<Image
								src={`${PB_URL}/api/files/service_provider/${id}/${images[currentImageIndex]}`}
								alt={`${title} - Image ${currentImageIndex + 1}`}
								width={5000}
								height={5000}
								className="w-full h-full object-cover"
							/>

							{/* Navigation arrows on main image */}
							<button
								onClick={prevImage}
								className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all"
								aria-label="Previous image"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={nextImage}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all"
								aria-label="Next image"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>

						{/* Thumbnail 2x2 grid */}
						{images.length > 1 && (
							<div className="flex-1 grid grid-cols-2 gap-2">
								{images.slice(0, 4).map((image, index) => (
									<div
										key={index}
										className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${index === currentImageIndex
											? 'ring-2 ring-green-500 ring-offset-1'
											: 'hover:opacity-80'
											}`}
										onClick={() => setCurrentImageIndex(index)}
									>
										<Image
											src={`${PB_URL}/api/files/service_provider/${id}/${image}`}
											alt={`${title} - Thumbnail ${index + 1}`}
											width={200}
											height={200}
											className="w-full h-full object-cover"
										/>
										{/* Overlay for non-active thumbnails */}
										{index !== currentImageIndex && (
											<div className="absolute inset-0 bg-black/30" />
										)}

										{/* Show more indicator on the last thumbnail if there are more images */}
										{index === 3 && images.length > 4 && (
											<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
												<span className="text-white font-bold text-sm">
													+{images.length - 4}
												</span>
											</div>
										)}
									</div>
								))}

								{/* Fill empty grid cells if less than 4 images */}
								{Array.from({ length: Math.max(0, 4 - images.length) }).map((_, index) => (
									<div key={`empty-${index}`} className="bg-gray-100 rounded-lg"></div>
								))}
							</div>
						)}
					</div>
				) : (
					<div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
						<span className="text-gray-500">No images available</span>
					</div>
				)}
			</div>

			{/* Right side - Information */}
			<div className="p-4 flex flex-col justify-between w-full md:w-3/5">
				<div>
					<h3 className="text-2xl font-semibold">{title}</h3>
					<div className="flex items-center mt-2 text-gray-600">
						<MapPin className="mr-1 w-5 h-5" />
						<span className="">{location}</span>
					</div>
					<div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
						{
							tags && tags.length > 0 ? tags.map((tag) => (
								<Button key={tag} title={tag} variant={'secondary'} className="rounded-md text-xs bg-[--var(--accent)]" />
							)) : (
								<span className="text-gray-500 text-xs italic">No tags available</span>
							)
						}
					</div>
					<div className="flex items-center mt-6">
						<RenderRatings rating={rating.toFixed(1)} />
						<span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
					</div>
					<p className="mt-6">{description}</p>
				</div>
				<div className="flex flex-wrap gap-4 mt-4">
					<RequestPopup provider={id} service={currentService} />
					<Button
						title={'View Details'}
						variant={'outline'}
						className="rounded-md"
						onClick={handleViewDetailsClick}
					/>
				</div>
			</div>

			{/* Login Popup for this specific service card */}
			{showLoginPopup && <LoginPopUp onOpen={handleLoginPopupClose} />}
		</div>
	);

}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, Warehouse, Truck, Ship, ShieldCheck,
  Search, MapPin, IndianRupee, Calendar, Clock,
  Lightbulb, Rocket, Handshake, Navigation
} from 'lucide-react';

export default function WhiteCard() {
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [numberOfVehicles, setNumberOfVehicles] = useState(1);
  const [tariffRange, setTariffRange] = useState(25000);
  const [freeDaysRange, setFreeDaysRange] = useState(7);
  const [activeService, setActiveService] = useState('cfs');

  const services = [
    { id: 'cfs', label: "CFS", icon: <Package size={24} /> },
    { id: 'transport', label: "Transport", icon: <Truck size={24} /> },
    { id: '3pl', label: "3PL", icon: <Handshake size={24} /> },
    { id: 'warehouse', label: "Warehouse", icon: <Warehouse size={24} /> },
    { id: 'customs', label: "Customs", icon: <ShieldCheck size={24} /> },
  ];

  const vehicleTypes = [
    'Truck',
    'Container Truck',
    'Flatbed Truck',
    'Refrigerated Truck',
    'Tanker Truck',
    'Cargo Van',
    'Pickup Truck',
    'Trailer'
  ];

  const handleServiceClick = (serviceId) => {
    setActiveService(serviceId);
    // Reset form fields when switching services
    setFromLocation('');
    setToLocation('');
    setVehicleType('');
    setNumberOfVehicles(1);
    setTariffRange(25000);
    setFreeDaysRange(7);
  };

  const handleSearch = () => {
    if (activeService === 'customs') {
      alert('Customs service coming soon!');
      return;
    }

    // Validation based on service type
    if (activeService === 'transport') {
      if (!fromLocation || !toLocation || !vehicleType) {
        alert('Please fill in all required fields for Transport service');
        return;
      }
    } else if (activeService === '3pl') {
      if (!fromLocation || !toLocation || !vehicleType) {
        alert('Please fill in all required fields for 3PL service');
        return;
      }
    } else {
      if (!fromLocation) {
        alert('Please enter your location');
        return;
      }
    }

    const searchParams = new URLSearchParams({
      location: fromLocation,
      service: activeService
    });

    // Add additional parameters based on service type
    if (activeService === 'transport') {
      searchParams.append('toLocation', toLocation);
      searchParams.append('vehicleType', vehicleType);
      searchParams.append('numberOfVehicles', numberOfVehicles.toString());
    } else if (activeService === '3pl') {
      searchParams.append('toLocation', toLocation);
      searchParams.append('vehicleType', vehicleType);
      searchParams.append('numberOfVehicles', numberOfVehicles.toString());
      searchParams.append('tariff', tariffRange.toString());
      searchParams.append('freeDays', freeDaysRange.toString());
    } else {
      searchParams.append('tariff', tariffRange.toString());
      searchParams.append('freeDays', freeDaysRange.toString());
    }

    if (activeService === 'transport') {
      router.push(`/transport?${searchParams.toString()}`);
    } else {
      router.push(`/customer/home?${searchParams.toString()}`);
    }
  };

  const getActiveServiceIndex = () => {
    return services.findIndex(service => service.id === activeService);
  };

  const getProgressWidth = () => {
    const activeIndex = getActiveServiceIndex();
    return `${(activeIndex / (services.length - 1)) * 100}%`;
  };

  const renderFormFields = () => {
    if (activeService === 'transport') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* From Location */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="text-primary" /> From Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter pickup location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* To Location */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Navigation className="text-green-500" /> To Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter delivery location"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Truck className="text-purple-500" /> Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg"
            >
              <option value="">Select vehicle type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Number of Vehicles */}
          <div className="space-y-3 md:col-span-3">
            <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Package className="text-orange-500" /> Number of Vehicles
            </label>
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-800">{numberOfVehicles}</span>
                <span className="text-sm text-gray-600">Vehicles</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={numberOfVehicles}
                onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>1 Vehicle</span>
                <span>10 Vehicles</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeService === '3pl') {
      return (
        <div className="space-y-6">
          {/* First Row: From and To Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="text-blue-500" size={18} /> From Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-base placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Navigation className="text-green-500" size={18} /> To Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter delivery location"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-base placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: Vehicle Type and Number of Vehicles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Truck className="text-purple-500" size={18} /> Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-base"
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Package className="text-orange-500" size={18} /> Number of Vehicles
              </label>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-800">{numberOfVehicles}</span>
                  <span className="text-sm text-gray-600">Vehicles</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={numberOfVehicles}
                  onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10B981 0%, #10B981 ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row: Tariff and Storage Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IndianRupee className="text-green-500" size={18} /> Max Tariff Rate
              </label>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-800">₹{tariffRange.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">Max Budget</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={tariffRange}
                  onChange={(e) => setTariffRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10B981 0%, #10B981 ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>₹5K</span>
                  <span>₹1L</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="text-purple-500" size={18} /> Free Storage Days
              </label>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-800">{freeDaysRange}</span>
                  <span className="text-sm text-gray-600">Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={freeDaysRange}
                  onChange={(e) => setFreeDaysRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10B981 0%, #10B981 ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Default form for CFS and Warehouse (unchanged)
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Location Input */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-500" /> Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Select your preferred {services.find(s => s.id === activeService)?.label} area
            </p>
          </div>

          {/* Tariff Rate */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <IndianRupee className="text-green-500" /> Max Tariff Rate
            </label>
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-800">₹{tariffRange.toLocaleString()}</span>
                <span className="text-sm text-gray-600">Max Budget</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={tariffRange}
                onChange={(e) => setTariffRange(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB 100%)`

                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>₹5,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Set your budget range
            </p>
          </div>

          {/* Free Storage Days */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="text-purple-500" /> Free Storage Days
            </label>
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-800">{freeDaysRange}</span>
                <span className="text-sm text-gray-600">Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={freeDaysRange}
                onChange={(e) => setFreeDaysRange(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>1 Day</span>
                <span>15 Days</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Up to {freeDaysRange} free storage days
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <section className="hidden sm:flex justify-center items-center h-screen w-full relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/whitecardbg.png')`,
          }}
        />
        {/* Van Image - Positioned at bottom-right */}
        <div className="absolute bottom-4 right-4 z-20">
          <img
            src="/Truck.png"
            alt="Delivery Van"
            className="w-full h-80 object-contain opacity-100"
          />
        </div>

        <div className="white-card relative min-h-[90dvh] w-[90%] bg-white/95 backdrop-blur-sm border rounded-lg shadow-2xl z-10">


          {/* Progress Line Background */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-[58%] h-1 bg-gray-300 rounded-full z-0" />

          {/* Animated Progress Line */}
          <div
            className="absolute top-24 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{
              width: '58%',
              clipPath: `inset(0 ${100 - parseFloat(getProgressWidth())}% 0 0)`
            }}
          />

          {/* Service Icons */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[60%] flex justify-between z-10">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className={`p-3 rounded-full mt-3 transition-all duration-300 ${activeService === service.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-200 text-green-500 hover:bg-blue-100'
                  }`}>
                  {service.icon}
                </div>
                <p className={`mt-2 text-sm font-medium text-center transition-all duration-300 ${activeService === service.id
                    ? 'text-primary font-bold'
                    : 'text-gray-600'
                  }`}>
                  {service.label}
                  {service.id === 'customs' && <span className="block text-xs text-orange-500">Coming Soon</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[85%] max-w-5xl">
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 ${activeService === '3pl' ? 'p-8' : 'p-12'
              }`}>

              {/* Header */}
              <div className={`text-center ${activeService === '3pl' ? 'mb-6' : 'mb-10'}`}>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  🔍 What Are You Looking For?
                </h2>
                <p className="text-gray-600">
                  Find the perfect {services.find(s => s.id === activeService)?.label} solution for your needs ✨
                </p>
              </div>

              {renderFormFields()}

              {/* Search Button */}
              <div className="text-center">
                <button
                  onClick={handleSearch}
                  disabled={
                    (activeService === 'transport' && (!fromLocation || !toLocation || !vehicleType)) ||
                    (activeService === '3pl' && (!fromLocation || !toLocation || !vehicleType)) ||
                    ((activeService === 'cfs' || activeService === 'warehouse') && !fromLocation)
                  }
                  className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Search className="w-6 h-6 mr-3" />
                  Search {services.find(s => s.id === activeService)?.label} Now
                  <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
                <p className="text-sm text-gray-600 mt-4 flex items-center gap-2 justify-center">
                  <Rocket className="w-4 h-4" /> Find the perfect solution in seconds
                </p>
              </div>

            </div>
          </div>

        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          
          .slider::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
        `}</style>
      </section>
    </div>
  );
}
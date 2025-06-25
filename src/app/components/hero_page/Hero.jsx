'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Ship, Plane, Truck, Menu, X } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from '@/components/ui/carousel';


export default function HeroPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            duration: 30, // Smooth transition duration
            dragFree: false,
            containScroll: 'trimSnaps'
        },
        [Autoplay({ delay: 2000, stopOnInteraction: false })] // 2 seconds autoplay
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);



    const heroImages = [
        '/bgimg.jpeg',
        '/bgimg1.jpeg',
        '/bgimg2.jpeg',
        '/bgimg3.webp',
    ];

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Carousel Background */}
            <div className="absolute inset-0 z-0 embla" ref={emblaRef}>
                <div className="flex h-full embla__container">
                    {heroImages.map((src, index) => (
                        <div
                            key={index}
                            className="relative flex-[0_0_100%] w-full h-screen embla__slide"
                        >
                            <Image
                                src={src}
                                alt={`Hero background ${index}`}
                                fill
                                className="object-cover transition-transform duration-700 ease-in-out"
                                priority={index === 0}
                                quality={100}
                                sizes="100vw"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                            <div className="absolute inset-0 bg-black/30" />

                            {/* First Slide - Global Logistics Solutions */}
                            {index === 0 && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center sm:items-start justify-center px-4 mt-20 text-center sm:text-left">
                                    <div
                                        className={`flex justify-center sm:justify-start space-x-3 mb-6 transition-all duration-800 ease-out ${selectedIndex === 0
                                            ? 'transform translate-y-0 scale-100 opacity-100'
                                            : 'transform translate-y-12 scale-75 opacity-0'
                                            }`}
                                        style={{
                                            transitionDelay: selectedIndex === 0 ? '0.3s' : '0s'
                                        }}
                                    >
                                        {[Ship, Plane, Truck].map((Icon, iconIndex) => (
                                            <div key={iconIndex} className="p-1.5 sm:p-3 rounded-full bg-[#effff1]">
                                                <Icon className="text-[#2e6f40]" size={18} />
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <h1
                                            className={`text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-1000 ease-out ${selectedIndex === 0
                                                ? 'transform translate-y-0 scale-100 opacity-100'
                                                : 'transform translate-y-16 scale-90 opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 0 ? '0.5s' : '0s'
                                            }}
                                        >
                                            Global Logistics Solutions
                                        </h1>
                                        <h3
                                            className={`text-white mt-4 text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-800 ease-out ${selectedIndex === 0
                                                ? 'transform translate-y-0 translate-x-0 opacity-100'
                                                : 'transform translate-y-8 translate-x-8 opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 0 ? '0.7s' : '0s'
                                            }}
                                        >
                                            Sustainable shipping solutions for a connected world
                                        </h3>
                                        <h3
                                            className={`text-white mt-2 text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-800 ease-out ${selectedIndex === 0
                                                ? 'transform translate-y-0 translate-x-0 opacity-100'
                                                : 'transform translate-y-8 -translate-x-8 opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 0 ? '0.9s' : '0s'
                                            }}
                                        >
                                            150+ Countries | 1000+ Routes | 24/7 Support
                                        </h3>
                                    </div>

                                    <div
                                        className={`flex flex-wrap gap-3 mt-6 justify-center sm:justify-start transition-all duration-800 ease-out ${selectedIndex === 0
                                            ? 'transform translate-y-0 scale-100 opacity-100'
                                            : 'transform translate-y-12 scale-75 opacity-0'
                                            }`}
                                        style={{
                                            transitionDelay: selectedIndex === 0 ? '1.1s' : '0s'
                                        }}
                                    >
                                        <Link href={'/customer/login'} className="text-[#2E6F40] bg-white px-4 py-1.5 text-xs sm:text-sm rounded-3xl">
                                            Sign In
                                        </Link>
                                        <Link href={'/client/login'} className="bg-[#2E6F40] text-white px-4 py-1.5 text-xs sm:text-sm rounded-3xl">
                                            Be a Merchant
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Second Slide - Line Split Animation */}
                            {index === 1 && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="text-center text-white relative">
                                        {/* Center Line that splits */}
                                        <div className="relative mb-8">
                                            <div
                                                className={`absolute left-1/2 top-1/2 h-0.5 bg-red-500 transition-all duration-400 ease-in-out ${selectedIndex === 1 ? 'w-24 -translate-x-12' : 'w-0 -translate-x-0'
                                                    }`}
                                                style={{ transitionDelay: selectedIndex === 1 ? '0.1s' : '0s' }}
                                            />
                                            <div
                                                className={`absolute left-1/2 top-1/2 h-0.5 bg-red-500 transition-all duration-400 ease-in-out ${selectedIndex === 1 ? 'w-24 translate-x-0' : 'w-0 translate-x-0'
                                                    }`}
                                                style={{ transitionDelay: selectedIndex === 1 ? '0.1s' : '0s' }}
                                            />
                                        </div>

                                        {/* Text that pops open */}
                                        <div className="overflow-hidden">
                                            <h1
                                                className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 transition-all duration-500 ease-out ${selectedIndex === 1
                                                    ? 'transform scale-100 opacity-100'
                                                    : 'transform scale-0 opacity-0'
                                                    }`}
                                                style={{
                                                    transitionDelay: selectedIndex === 1 ? '0.5s' : '0s'
                                                }}
                                            >
                                                DELIVERING EXCELLENCE
                                            </h1>
                                        </div>

                                        <div className="overflow-hidden">
                                            <p
                                                className={`text-lg md:text-xl lg:text-2xl mb-8 transition-all duration-400 ease-out ${selectedIndex === 1
                                                    ? 'transform scale-100 opacity-100'
                                                    : 'transform scale-0 opacity-0'
                                                    }`}
                                                style={{
                                                    transitionDelay: selectedIndex === 1 ? '0.7s' : '0s'
                                                }}
                                            >
                                                Fast International Cargo Services
                                            </p>
                                        </div>

                                        {/* Closing lines */}
                                        <div className="relative mt-8">
                                            <div
                                                className={`absolute left-1/2 top-1/2 h-0.5 bg-red-500 transition-all duration-400 ease-in-out ${selectedIndex === 1 ? 'w-24 -translate-x-24' : 'w-0 -translate-x-0'
                                                    }`}
                                                style={{ transitionDelay: selectedIndex === 1 ? '1.0s' : '0s' }}
                                            />
                                            <div
                                                className={`absolute left-1/2 top-1/2 h-0.5 bg-red-500 transition-all duration-400 ease-in-out ${selectedIndex === 1 ? 'w-24 translate-x-0' : 'w-0 translate-x-0'
                                                    }`}
                                                style={{ transitionDelay: selectedIndex === 1 ? '1.0s' : '0s' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Third Slide - Text from Right */}
                            {index === 2 && (
                                <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20">
                                    <div className="text-white text-right">
                                        <h1
                                            className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 transition-all duration-600 ease-out ${selectedIndex === 2
                                                ? 'transform translate-x-0 rotate-0 opacity-100'
                                                : 'transform translate-x-full rotate-12 opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 2 ? '0.2s' : '0s'
                                            }}
                                        >
                                            WORLDWIDE REACH
                                        </h1>
                                        <p
                                            className={`text-lg md:text-xl lg:text-2xl mb-4 transition-all duration-500 ease-out ${selectedIndex === 2
                                                ? 'transform translate-x-0 opacity-100'
                                                : 'transform translate-x-full opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 2 ? '0.4s' : '0s'
                                            }}
                                        >
                                            150+ Countries Connected
                                        </p>
                                        <div
                                            className={`w-32 h-1 bg-blue-500 ml-auto transition-all duration-400 ease-in-out ${selectedIndex === 2 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 2 ? '0.6s' : '0s',
                                                transformOrigin: 'right'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Fourth Slide - Text from Bottom Left */}
                            {index === 3 && (
                                <div className="absolute bottom-20 left-8 z-20">
                                    <div className="text-white">
                                        <h1
                                            className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 transition-all duration-600 ease-out ${selectedIndex === 3
                                                ? 'transform translate-x-0 translate-y-0 opacity-100'
                                                : 'transform -translate-x-full translate-y-8 opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 3 ? '0.2s' : '0s'
                                            }}
                                        >
                                            FAST DELIVERY
                                        </h1>
                                        <p
                                            className={`text-lg md:text-xl lg:text-2xl transition-all duration-500 ease-out ${selectedIndex === 3
                                                ? 'transform translate-x-0 translate-y-0 opacity-100'
                                                : 'transform -translate-x-full translate-y-4 opacity-0'
                                                }`}
                                            style={{
                                                transitionDelay: selectedIndex === 3 ? '0.4s' : '0s'
                                            }}
                                        >
                                            Express Shipping Solutions
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Enhanced Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (emblaApi) {
                                    emblaApi.scrollTo(index);
                                }
                            }}
                            className={`relative transition-all duration-300 ease-in-out ${index === selectedIndex
                                ? 'w-8 h-3 bg-white rounded-full shadow-lg'
                                : 'w-3 h-3 bg-white/60 rounded-full hover:bg-white/80 hover:scale-110'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Navbar */}
            <nav className="absolute bg-black/60 top-0 left-0 right-0 z-10 flex justify-between items-center px-6 py-3 h-auto">
                <h1 className="text-white text-3xl font-bold">GOL</h1>
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
                    </button>
                </div>

                <div className={`absolute md:static top-20 md:top-0 right-0 w-3/4 md:w-auto md:flex transition-all duration-300 ease-in-out z-20
  ${menuOpen ? 'flex flex-col bg-white/90 shadow-lg rounded-l-lg p-6' : 'hidden'}
  md:flex md:flex-row md:bg-transparent md:shadow-none md:rounded-none md:p-0 space-y-4 md:space-y-0 md:space-x-10`}>

                    {[
                        { text: 'Services', href: '/services' },
                        { text: 'Tracking', href: '/tracking' },
                        { text: 'About Us', href: '/about' },
                        { text: 'Contact Us', href: '/contact' },
                    ].map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="cursor-pointer text-[#2E6F40] md:text-white hover:underline text-lg font-semibold"
                        >
                            {item.text}
                        </Link>
                    ))}
                </div>
            </nav>


        </section>
    );
}

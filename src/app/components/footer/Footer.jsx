'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer>
            {/* Top Banner */}
            <div className="bg-primary w-full px-4 py-10 mt-30 flex flex-col justify-center items-center text-center">
                <h1 className="text-white text-2xl sm:text-3xl font-sans font-semibold">We Are Here To Talk</h1>
                <p className="text-gray-300 mt-3 max-w-xl">
                    Have questions about our services? Our expert team is here to help you with any inquiries.
                </p>
                <Link href="/contact">
                    <button className="text-light-primary bg-white py-1.5 px-4 mt-4 rounded-md">
                        Contact Us
                    </button>
                </Link>
            </div>

            {/* Footer Links */}
            <div className="footer-text pl-8 mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-light-primary">
                <div className="pr-10">
                    <h2 className="font-bold mb-2">Green Ocean</h2>
                    <p>Sustainable global logistics solutions for a better tomorrow.</p>
                </div>

                <div>
                    <h2 className="font-bold mb-2">Quick Links</h2>
                    <ul className="space-y-1">
                        <li>
                        <button>
                            <Link href="/about" className="hover:text-primary transition-colors">
                                About Us
                            </Link>
                        </button>
                        </li>
                        <li>
                        <button>
                            <Link href="/services" className="hover:text-primary transition-colors">
                                Services
                            </Link>
                        </button>
                        </li>
                        <li>
                        <button>
                            <Link href="/tracking" className="hover:text-primary transition-colors">
                                Track Shipment
                            </Link>
                        </button>
                        </li>
                         <li>
                        <button>
                            <Link href="/contact" className="hover:text-primary transition-colors">
                                Contact
                            </Link>
                        </button>
                      </li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-bold mb-2">Services</h2>
                    <ul className="space-y-1">
                         <li>
                        <button>
                            <Link href="/customer/home" className="hover:text-primary transition-colors">
                                CFS
                            </Link>
                        </button>
                        </li>
                        <li>
                        <button>
                            <Link href="/customer/home" className="hover:text-primary transition-colors">
                                Transport
                            </Link>
                        </button>
                        </li>
                        <li>
                        <button>
                            <Link href="/customer/home" className="hover:text-primary transition-colors">
                                3PL
                            </Link>
                        </button>
                        </li>
                        <li>
                        <button>
                            <Link href="/customer/home" className="hover:text-primary transition-colors">
                                Warehouse
                            </Link>
                        </button>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-bold mb-2">Contact</h2>
                    <ul className="space-y-1">
                        <li>
                            <button>
                            <a href="mailto:support@greenocean.com" className="hover:text-primary transition-colors">
                                support@greenocean.com
                            </a>
                            </button>
                        </li>
                        <li>
                            <a href="tel:+919892464661" className="hover:text-primary transition-colors">
                                +91 9892464661
                            </a>
                        </li>
                        <li>Tower 2, 608 E Wing Sea Woods Grand Central</li>
                        <li>Plot No R 1, Nerul, Thane, Maharashtra, 400706</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-green-800 py-4 text-center text-md font-semibold text-primary">
                © 2025 SKZ TECH. All rights reserved.
            </div>
        </footer>
    );
}
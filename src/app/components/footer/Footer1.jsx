export default function Footer() {
    return (
        <footer>
            {/* Top Banner */}
            <div className="bg-[#2E6F40] w-full px-4 py-10 mt-30 flex flex-col justify-center items-center text-center">
                <h1 className="text-white text-2xl sm:text-3xl font-sans font-semibold">We Are Here To Talk</h1>
                <p className="text-gray-300 mt-3 max-w-xl">
                    Have questions about our services? Our expert team is here to help you with any inquiries.
                </p>
                <button className="text-[#2E6F40] bg-white py-1.5 px-4 mt-4 rounded-md">
                    Contact Us
                </button>
            </div>

            {/* Footer Links */}
            <div className="footer-text pl-8 mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10  text-[#2E6F40]">
                <div className="pr-10">
                    <h2 className="font-bold mb-2 ">Green Ocean</h2>
                    <p>Sustainable global logistics solutions for a better tomorrow.</p>
                </div>

                <div>
                    <h2 className="font-bold mb-2">Quick Links</h2>
                    <ul className="space-y-1">
                        <li>About Us</li>
                        <li>Services</li>
                        <li>Track Shipment</li>
                        <li>Contact</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-bold mb-2">Services</h2>
                    <ul className="space-y-1">
                        <li>Sea Freight</li>
                        <li>Air Freight</li>
                        <li>Road Transport</li>
                        <li>Express Delivery</li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-bold mb-2">Contact</h2>
                    <ul className="space-y-1">
                        <li>support@greenocean.com</li>
                        <li>+1 (555) 123-4567</li>
                        <li>123 Logistics Way</li>
                        <li>Singapore, 123456</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-green-800 py-4 text-center text-md font-semibold text-[#2E6F40]">
                © 2024 SKZ TECH. All rights reserved.
            </div>
        </footer>
    );
}

'use client';
import { Search, } from 'lucide-react';
import HeroPage from './components/hero_page/Hero';
import WhiteCard from './components/white-card/WhiteCard';
import Packages from './components/packages/Packages';
import GreenCard from './components/green-card/GreenCard';
import FAQ from './components/faq/FAQ';
import Footer from './components/footer/Footer';

export default function Home() {

  const info = [
    { no: "5.6K+", label: "Global Partners" },
    { no: "100K", label: "Monthly Deliveries" },
    { no: "24/7", label: "Customer Support" },
    { no: "150K+", label: "Satisfied Customers" },
  ];



  return (
    <div className="bg-[#effff1]">

      <HeroPage />



      <WhiteCard />

      <Packages />
      <section className="px-6 sm:px-20 py-16 bg-white mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1D591F] mb-10 text-center">
          News & Updates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* News Cards */}
          <div className="md:col-span-2 space-y-8">
            {/* Card 1 */}
            <div className="bg-[#effff1] rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              <img
                src="https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg"
                alt="Singapore Logistics Hub"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2E6F40]">
                  New Hub Opened in Singapore
                </h3>
                <p className="mt-2 text-gray-700">
                  We’ve officially launched our new logistics hub in Singapore to better serve customers in Southeast Asia. This hub increases our regional delivery capacity by 40%.
                </p>
                <span className="text-sm text-gray-500 mt-2 block">
                  Posted on May 28, 2025
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#effff1] rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              <img
                src="https://images.pexels.com/photos/221047/pexels-photo-221047.jpeg"
                alt="Eco-Friendly Packaging"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2E6F40]">
                  CFS Launches Eco-Friendly Packaging
                </h3>
                <p className="mt-2 text-gray-700">
                  In our mission to reduce carbon footprint, CFS is introducing recyclable, biodegradable packaging materials across all services globally.
                </p>
                <span className="text-sm text-gray-500 mt-2 block">
                  Posted on May 20, 2025
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#effff1] rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg"
                alt="24/7 Customer Support"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2E6F40]">
                  24/7 Customer Service Now Available
                </h3>
                <p className="mt-2 text-gray-700">
                  You spoke, we listened! Our support team is now available around the clock to assist you with tracking, quotes, and service inquiries.
                </p>
                <span className="text-sm text-gray-500 mt-2 block">
                  Posted on May 15, 2025
                </span>
              </div>
            </div>
          </div>

          {/* Updates Sidebar */}
          <aside className="bg-[#f4fdf6] p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-bold text-[#1D591F] mb-4">Latest Updates</h4>
            <ul className="space-y-4 text-sm text-gray-700 list-disc list-inside">
              <li><span className="font-semibold">June 5:</span> Scheduled maintenance from 12:00 AM to 3:00 AM GMT.</li>
              <li><span className="font-semibold">New Feature:</span> Real-time driver GPS tracking is live.</li>
              <li><span className="font-semibold">Reminder:</span> Submit customs documents 24 hours before shipping.</li>
              <li><span className="font-semibold">Update:</span> Mobile app v3.2 now supports dark mode and QR scanning.</li>
              <li><span className="font-semibold">Notice:</span> Expect delays in some regions due to severe weather.</li>
            </ul>
          </aside>
        </div>
      </section>



      <div className="bg-[#2E6F40] h-40 py-6 mt-10 flex flex-wrap justify-center items-center gap-y-4 gap-x-20 sm:gap-60 px-4">
        {info.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-white text-xs sm:text-base">
            <h1 className="text-lg sm:text-3xl font-bold">{item.no}</h1>
            <h3 className="mt-1 text-[10px] sm:text-sm text-center">{item.label}</h3>
          </div>
        ))}
      </div>



      <GreenCard />



      <section className="text-center mt-10">
        <h1 className="text-[#1D591F] font-bold text-2xl sm:text-3xl">Track Your Package</h1>
        <p className="text-[#206413] mt-5 mr-10 ml-15 sm:text-xl">
          Enter your tracking number to get real-time updates on your shipment.
        </p>

        <div className="flex flex-col sm:flex-row justify-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4 items-center">
          <input
            type="text"
            placeholder="Enter tracking number..."
            className="w-80 sm:w-96 px-3 py-1 sm:px-5 sm:py-2 rounded-md border font-sans bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
          />
          <button className="bg-[#2E6F40] text-white px-10 py-2 rounded-md flex items-center space-x-2 hover:bg-[#245c34] transition">
            <Search size={18} />
            <span>Track</span>
          </button>
        </div>

      </section>

      <FAQ />
      <Footer />
    </div>
  );
}

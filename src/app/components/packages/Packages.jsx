'use client';
import { MoveRight, Leaf, Globe, Users, Truck, Plane, Package, Ship } from 'lucide-react';

export default function Packages() {

    const icons2 = [
        { label: "Sustainability First", icon: <Leaf size={36} />, p: "Committed to reducing carbon footprint through innovative solutions." },
        { label: "Global Network", icon: <Globe size={36} />, p: "Connected worldwide with reliable partners and efficient routes." },
        { label: "Expert Team", icon: <Users size={36} />, p: "Professional staff dedicated to your logistics needs." },

    ];

    const packages = [
        {
            title: "Marine CFS",
            icon: <Ship size={24} />,
            features: ["Container Freight", "Port Handling", "Custom Clearance"]
        },
        {
            title: "Express CFS",
            icon: <Truck size={24} />,
            features: ["Same Day Delivery", "Door to Door", "Real-time Tracking"]
        },
        {
            title: "Global CFS",
            icon: <Plane size={24} />,
            features: ["Air Freight", "Express Shipping", "Global Coverage"]
        },
        {
            title: "Singapore CFS",
            icon: <Package size={24} />,
            features: ["Local Delivery", "Warehousing", "Distribution"]
        },
        {
            title: "Rotterdam CFS",
            icon: <Ship size={24} />,
            features: ["European Hub", "Port Services", "Consolidation"]
        },
        {
            title: "Los Angeles CFS",
            icon: <Truck size={24} />,
            features: ["US Distribution", "Custom Brokerage", "Storage"]
        }
    ];



    return (
        <div>
            <section className="py-16 bg-[#effff1] text-center">
                <h1 className="text-xl sm:text-2xl mr-5 md:text-3xl lg:text-4xl font-bold text-[#3C4D03] mb-4 text-center ">
                    Pioneering Sustainable Global Logistics
                </h1>
                <p className="text-sm sm:text-base  lg:text-lg text-center text-[#3C4D03] mb-12 max-w-xl mx-auto ">
                    Our eco-conscious initiatives help preserve our planet while delivering exceptional service.
                </p>


                <div className="flex flex-col md:flex-row justify-center items-center gap-10 px-4 sm:px-6 md:px-20">
                    {icons2.map((icon, index) => (
                        <div key={index} className="flex flex-col items-center max-w-xs text-center">
                            <div className="text-[#16A34A] mb-3 text-2xl sm:text-3xl md:text-4xl">{icon.icon}</div>
                            <p className="text-base sm:text-lg font-bold text-[#0e1d07] mb-1">{icon.label}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{icon.p}</p>
                        </div>
                    ))}
                </div>

            </section>
            <section className="bg-[#D1F0D5] py-12">
                <div className="mx-auto w-[90%] relative ">

                    <div className="flex flex-row mt-15  ">
                        <h1 className="text-[#3C4D03] text-2xl font-bold text-center sm:text-left w-full sm:w-auto sm:ml-13">Our Packages</h1>
                        <div className="hidden md:flex flex-wrap items-center ml-10 space-x-6">
                            <button className="bb text-gray-700 text-1xl mt-1 ml-20 hover:text-[#3C4D03] hover:underline hover:mt-0" >CFS Plus</button>
                            <button className="bb text-gray-700 text-1xl mt-1 ml-20 hover:text-[#3C4D03] hover:underline hover:mt-0">CFS Transport</button>
                            <button className="bb text-gray-700 text-1xl mt-1 ml-20 hover:text-[#3C4D03] hover:underline hover:mt-0">CFS Package</button>
                            <button className="bb text-gray-700 text-1xl mt-1 ml-20 hover:text-[#3C4D03] hover:underline hover:mt-0">CFS Plus</button>
                            <button className="bb text-gray-700 text-1xl mt-1 ml-20 hover:text-[#3C4D03] hover:underline hover:mt-0">CFS Transport</button>

                            <button className="text-[#3C4D03] text-2xl font-bold ml-5 flex flex-row ">View All  <MoveRight size={24} /> </button>
                        </div>
                    </div>

                    <section className="cards flex gap-10 flex-wrap justify-center mt-10 mb-10 px-5">
                        {packages.map((pkg, index) => (
                            <div key={index} className="bg-white h-65 w-90 p-5 rounded-lg shadow-md flex flex-col justify-between transform transition duration-300 hover:scale-[1.03] hover:shadow-lg">

                                <div className="text-[#2E6F40] mb-2">{pkg.icon}</div>
                                <h2 className="text-xl font-bold text-[#3C4D03] mb-2">{pkg.title}</h2>

                                <ul className="text-sm text-gray-600 mb-4 space-y-2">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <MoveRight size={16} className="text-[#2E6F40] mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="bg-[#2E6F40] text-white px-5 py-1.5 rounded-md mt-auto self-center sm:self-start sm:ml-6 sm:px-[100px]">
                                    Get Quote
                                </button>


                            </div>
                        ))}
                    </section>


                </div>


            </section>

        </div>
    );
}
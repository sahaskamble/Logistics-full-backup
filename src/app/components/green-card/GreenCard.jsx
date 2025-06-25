import { Ship, Truck, Plane, Package } from "lucide-react";

export default function GreenCard() {
    const cards = [
        { icon: <Ship size={32} />, label: "CFS", p: "Global sea freight solutions" },
        { icon: <Truck size={32} />, label: "Transport", p: "Nationwide road transportation" },
        { icon: <Plane size={32} />, label: "3PL", p: "All Services in one place" },
        { icon: <Package size={32} />, label: "Warehouse", p: "Storage Facilities Available" },
    ];

    return (
        <section className="text-center bg-accent py-16 mt-10">
            <h1 className="text-primary font-bold text-2xl sm:text-3xl">We Have Everything</h1>
            <p className="mt-4  mr-10 ml-15 sm:text-xl text-light-primary">Comprehensive logistics solutions for all your shipping needs.</p>
            <div className="flex justify-center gap-8 flex-wrap mt-10">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-primary text-white w-70 p-6 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition-transform duration-300"
                    >
                        <div>{card.icon}</div>
                        <h2 className="font-semibold text-lg mt-4">{card.label}</h2>
                        <p className="text-sm mt-2 text-center">{card.p}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

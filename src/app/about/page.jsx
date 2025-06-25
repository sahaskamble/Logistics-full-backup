'use client';
import Image from 'next/image';
import Footer from '../components/footer/Footer';

export default function AboutUs() {
    return (
        <section className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f3eb] to-[#d4e6d2] flex flex-col items-center overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/bgimg2.jpeg"
                    alt="About Hero"
                    fill
                    className="object-cover object-center brightness-75 scale-105 transition-transform duration-700"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center z-10 px-4">
                    <h1 className="text-white text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-fade-up">
                        Who We Are
                    </h1>
                    <p className="text-white/90 text-lg md:text-2xl mt-4 max-w-2xl animate-fade-up delay-[200ms]">
                        GOL is redefining global logistics with technology, sustainability, and a human touch.
                    </p>
                </div>
            </div>

            {/* Our Story */}
            <div className="w-full max-w-6xl px-4 md:px-8 py-20 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-5 animate-fade-right">
                    <h2 className="text-4xl font-bold text-[#2E6F40]">Our Story</h2>
                    <p className="text-[#3C4D03] text-lg leading-relaxed">
                        Founded in 2010, GOL started as a small team with a big dream: to make logistics seamless,
                        sustainable, and accessible. Today, we connect businesses and people across 150+ countries.
                    </p>
                    <ul className="grid grid-cols-2 gap-2 text-[#2E6F40] font-medium list-disc pl-5">
                        <li>150+ Countries Served</li>
                        <li>1000+ Global Routes</li>
                        <li>24/7 Customer Support</li>
                        <li>Green Shipping</li>
                    </ul>
                </div>
                <div className="flex-1 flex justify-center animate-fade-left">
                    <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-xl border-4 border-[#2E6F40]/20">
                        <Image
                            src="/bgimg1.jpeg"
                            alt="Our Team"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="w-full bg-[#2E6F40] py-20 px-4 text-white text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 animate-fade-up">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[
                        {
                            icon: '/globe.svg',
                            title: 'Global Reach',
                            desc: 'Connecting continents, empowering businesses everywhere.',
                        },
                        {
                            icon: '/cargo-ship.png',
                            title: 'Sustainability',
                            desc: 'Eco-friendly solutions for a greener planet.',
                        },
                        {
                            icon: '/window.svg',
                            title: 'Innovation',
                            desc: 'Smart tech and creative minds drive our progress.',
                        },
                    ].map((value, i) => (
                        <div
                            key={i}
                            className="bg-white text-[#2E6F40] rounded-xl shadow-md p-6 flex flex-col items-center transition-transform hover:scale-105 animate-fade-up"
                        >
                            <Image src={value.icon} alt={value.title} width={48} height={48} className="mb-4" />
                            <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                            <p className="text-[#3C4D03] text-center">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leadership */}
            <div className="py-20 px-4 max-w-6xl mx-auto text-center">
                <h3 className="text-3xl font-bold text-[#2E6F40] mb-10 animate-fade-up">Meet Our Leadership</h3>
                <div className="flex flex-wrap justify-center gap-8">
                    {[
                        { name: 'Alex Carter', role: 'CEO & Founder', img: '/bgimg4.webp' },
                        { name: 'Priya Singh', role: 'Head of Operations', img: '/bgimg2.jpeg' },
                        { name: 'Liam Chen', role: 'Logistics Manager', img: '/bgimg3.webp' },
                    ].map((member, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-lg p-6 w-60 flex flex-col items-center hover:scale-105 transition-transform animate-fade-up"
                        >
                            <Image
                                src={member.img}
                                alt={member.name}
                                width={80}
                                height={80}
                                className="rounded-full object-cover mb-3"
                            />
                            <span className="font-semibold text-[#2E6F40]">{member.name}</span>
                            <span className="text-[#666A6D] text-sm">{member.role}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />

            {/* Animations */}
            <style jsx>{`
                .animate-fade-up {
                    animation: fadeUp 0.8s ease-out both;
                }
                .animate-fade-left {
                    animation: fadeLeft 0.8s ease-out both;
                }
                .animate-fade-right {
                    animation: fadeRight 0.8s ease-out both;
                }
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fadeRight {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </section>
    );
}

// app/contact/page.tsx
'use client';
import Image from 'next/image';
import Footer from '../components/footer/Footer';

export default function ContactUs() {
    return (
        <section className="min-h-screen bg-gradient-to-br from-[#e8f3eb] to-[#d4e6d2] flex flex-col items-center overflow-x-hidden">
            {/* Hero */}
            <div className="relative w-full h-[40vh] flex items-center justify-center">
                <Image
                    src="/bgimg3.webp"
                    alt="Contact Us Hero"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10">
                    <h1 className="text-white text-5xl font-extrabold drop-shadow-lg">Contact Us</h1>
                    <p className="text-white/90 text-lg mt-3">We’re here to help. Reach out anytime.</p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="w-full max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-white/90 p-8 rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-bold text-[#2E6F40] mb-6">Get in Touch</h2>
                    <form className="space-y-5">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full border border-[#2E6F40]/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full border border-[#2E6F40]/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                            required
                        />
                        <textarea
                            rows={5}
                            placeholder="Your Message"
                            className="w-full border border-[#2E6F40]/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-[#2E6F40] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#265a34] transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Info + Map */}
                <div className="flex flex-col justify-between">
                    <div className="bg-white/90 p-8 rounded-2xl shadow-xl mb-6">
                        <h3 className="text-2xl font-bold text-[#2E6F40] mb-4">Our Office</h3>
                        <p className="text-[#3C4D03] mb-2">GOL Global Logistics HQ</p>
                        <p className="text-[#3C4D03] mb-2">123 Innovation Drive</p>
                        <p className="text-[#3C4D03] mb-2">San Francisco, CA 94107</p>
                        <p className="text-[#3C4D03] mb-2">Email: contact@gol.com</p>
                        <p className="text-[#3C4D03]">Phone: +1 (800) 555-1234</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl h-64">
                        <iframe
                            title="GOL Office Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0869394935223!2d-122.39769568468161!3d37.7785192797584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807cbae9f14b%3A0x903bcde34bb2bca1!2s123%20Innovation%20Dr%2C%20San%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1685805369394"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />
        </section>
    );
}

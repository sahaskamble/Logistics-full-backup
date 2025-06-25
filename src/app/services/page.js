'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Truck, Warehouse, Package, Container, MapPin,
  MessageCircle, CheckCircle, ArrowRight, Shield, Clock, Users
} from 'lucide-react';
import Footer from '../components/footer/footer'; // Adjust if path is different

const ServicesPage = () => {
  const router = useRouter();

  const mainServices = [
    {
      id: 'cfs',
      title: 'CFS Services',
      description: 'Container Freight Station services for efficient cargo handling, storage, and distribution.',
      icon: <Container className="w-12 h-12" />,
      features: [
        'Container loading and unloading',
        'Cargo consolidation and deconsolidation',
        'Customs clearance assistance',
        'Secure storage facilities',
        'Documentation handling'
      ],
      benefits: 'Streamline your import/export operations with our comprehensive CFS solutions.'
    },
    {
      id: 'transport',
      title: 'Transport Services',
      description: 'Reliable transportation solutions for your cargo across various modes and distances.',
      icon: <Truck className="w-12 h-12" />,
      features: [
        'Road transportation',
        'Rail freight services',
        'Multi-modal transport',
        'Express delivery options',
        'Temperature-controlled transport'
      ],
      benefits: 'Ensure timely and safe delivery of your goods with our extensive transport network.'
    },
    {
      id: 'warehouse',
      title: 'Warehouse Services',
      description: 'State-of-the-art warehousing solutions for efficient inventory management and storage.',
      icon: <Warehouse className="w-12 h-12" />,
      features: [
        'Climate-controlled storage',
        'Inventory management systems',
        'Pick and pack services',
        'Cross-docking facilities',
        'Security and surveillance'
      ],
      benefits: 'Optimize your supply chain with our modern warehousing infrastructure.'
    },
    {
      id: '3pl',
      title: '3PL Services',
      description: 'Comprehensive third-party logistics solutions to manage your entire supply chain.',
      icon: <Package className="w-12 h-12" />,
      features: [
        'End-to-end supply chain management',
        'Order fulfillment',
        'Distribution services',
        'Returns processing',
        'Value-added services'
      ],
      benefits: 'Focus on your core business while we handle your complete logistics operations.'
    }
  ];

  const platformFeatures = [
    {
      title: 'Live Tracking System',
      description: 'Real-time visibility of your shipments and cargo status throughout the journey.',
      icon: <MapPin className="w-10 h-10" />,
      features: [
        'GPS-enabled tracking',
        'Real-time status updates',
        'Route optimization',
        'Delivery notifications',
        'Historical tracking data'
      ]
    },
    {
      title: 'Chat System',
      description: 'Instant communication platform for seamless coordination with our team.',
      icon: <MessageCircle className="w-10 h-10" />,
      features: [
        '24/7 customer support',
        'Direct communication with drivers',
        'File sharing capabilities',
        'Multi-language support',
        'Issue resolution tracking'
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Reliable & Secure',
      description: 'Advanced security measures and reliable service delivery'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Operations',
      description: 'Round-the-clock services to meet your business needs'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Team',
      description: 'Experienced professionals dedicated to your success'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <main className="flex-grow">
        
  
        <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
          <Image
            src="/bgimg1.jpeg"
            alt="About Hero"
            fill
            className="object-cover object-center brightness-75 scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center z-10 px-4">
            <h1 className="text-white text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-fade-up">
              Our Services
            </h1>
            <p className="text-white/90 text-lg md:text-2xl mt-4 max-w-2xl animate-fade-up delay-[200ms]">
              Comprehensive logistics solutions designed to streamline your supply chain operations and drive business growth.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-6 px-4 py-2 bg-white text-black rounded-lg text-sm hover:bg-gray-200 transition"
            >
              ← Go Back
            </button>
          </div>
        </div>

       
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--primary)' }}>
              Core Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mainServices.map((service) => (
                <div
                  key={service.id}
                  className="p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300"
                  style={{ background: 'var(--accent)', borderColor: 'var(--primary)' }}
                >
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-lg mr-4" style={{ background: 'var(--primary)', color: 'var(--background)' }}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-semibold" style={{ color: 'var(--primary)' }}>
                      {service.title}
                    </h3>
                  </div>
                  <p className="mb-6" style={{ color: 'var(--secondary)' }}>{service.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>Key Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" style={{ color: 'var(--light-primary)' }} />
                          <span style={{ color: 'var(--foreground)' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--background-2)' }}>
                    <p style={{ color: 'var(--primary)' }}>{service.benefits}</p>
                  </div>
                  <button className="flex items-center justify-center w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg" style={{ background: 'var(--primary)', color: 'var(--background)' }}>
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

       
        <section className="py-16 px-4" style={{ background: 'var(--accent)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--primary)' }}>
              Advanced Platform Features
            </h2>
            <p className="text-center mb-12" style={{ color: 'var(--secondary)' }}>
              Our software platform enhances your logistics experience with cutting-edge features
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="p-8 rounded-xl shadow-lg border" style={{ background: 'var(--background)', borderColor: 'var(--primary)' }}>
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-lg mr-4" style={{ background: 'var(--light-primary)', color: 'var(--background)' }}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold" style={{ color: 'var(--primary)' }}>{feature.title}</h3>
                  </div>
                  <p className="mb-6" style={{ color: 'var(--secondary)' }}>{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ background: 'var(--light-primary)' }} />
                        <span style={{ color: 'var(--foreground)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

 
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--primary)' }}>
              Why Choose Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="text-center p-6 rounded-xl" style={{ background: 'var(--accent)' }}>
                  <div className="inline-flex p-4 rounded-full mb-4" style={{ background: 'var(--primary)', color: 'var(--background)' }}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--secondary)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;

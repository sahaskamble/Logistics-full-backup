'use client';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Package, Truck, MessageCircle, BarChart3, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CustomerRegistrationSuccess() {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(true);

    const progress = [
        { n: 1, h: "Register" },
        { n: 2, h: "Profile" },
        { n: 3, h: "Verification" },
        { n: 4, h: "Completed" },
    ];

    const features = [
        {
            icon: Package,
            title: "Container Tracking",
            description: "Track your containers in real-time across all ports and terminals"
        },
        {
            icon: Truck,
            title: "Transport Services",
            description: "Book and manage transport services for your cargo"
        },
        {
            icon: MessageCircle,
            title: "Direct Communication",
            description: "Chat directly with service providers and logistics partners"
        },
        {
            icon: BarChart3,
            title: "Analytics & Reports",
            description: "Get insights into your logistics operations and costs"
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleGetStarted = () => {
        router.push('/customer/login');
    };

    const handleExploreFeatures = () => {
        router.push('/customer/home');
    };

    return (
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
            style={{ backgroundImage: 'url("/cargo-ship.png")' }}
        >
            <div className="absolute -z-[1] top-0 left-0 w-full min-h-screen bg-black/60"></div>
            
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-green-500 rounded-full animate-bounce"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-green-700">Green Ocean Logistics</div>
                    <h2 className="text-2xl font-semibold text-green-800 mt-2">Welcome Aboard!</h2>
                    <p className="text-sm text-gray-600 mt-1">Your account has been created successfully</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {progress.map((step, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white">
                                    {step.n}
                                </div>
                                <span className="text-xs mt-1 text-gray-600">{step.h}</span>
                            </div>
                        ))}
                    </div>
                    <Progress value={100} className="h-2" />
                </div>

                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle className="text-green-500" size={64} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                        Registration Complete!
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                        Congratulations! Your customer account has been successfully created. 
                        You now have access to our comprehensive logistics platform.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        What you can do now:
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white/50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <feature.icon className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 text-sm">
                                            {feature.title}
                                        </h5>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleGetStarted}
                        className="w-full h-12 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        Get Started
                        <ArrowRight size={16} />
                    </button>
                    
                    <button
                        onClick={handleExploreFeatures}
                        className="w-full h-12 border border-green-600 text-green-600 rounded-md font-semibold hover:bg-green-50 transition"
                    >
                        Explore Features
                    </button>
                </div>

                {/* Next Steps */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">Next Steps:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Complete your profile for better service recommendations</li>
                        <li>• Explore available logistics services in your area</li>
                        <li>• Connect with verified service providers</li>
                        <li>• Start tracking your first shipment</li>
                    </ul>
                </div>

                {/* Support */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Need help getting started?{' '}
                        <a 
                            href="/customer/support" 
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Contact Support
                        </a>
                        {' '}or{' '}
                        <a 
                            href="/customer/support/chat" 
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Start a Chat
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

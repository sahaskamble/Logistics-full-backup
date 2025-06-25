'use client';
import { Progress } from "@/components/ui/progress";

import {
    Package,
    UserRound,
    Phone,
    Mail,
    Lock,
    Truck,
    ShieldHalf,
    ChartSpline,
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import pb from '@/lib/db';
import { toast } from 'sonner';

export default function CustomerRegistrationPage() {
    const router = useRouter();

    const progress = [
        { n: 1, h: "Register" },
        { n: 2, h: "Profile" },
        { n: 3, h: "Verification" },
        { n: 4, h: "Completed" },
    ];

    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    // Check if all required fields are filled
    const allRequiredFilled = 
        formData.username.trim() !== '' &&
        formData.firstname.trim() !== '' &&
        formData.lastname.trim() !== '' &&
        formData.phone.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.password.trim() !== '' &&
        formData.confirmPassword.trim() !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!allRequiredFilled) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setIsSubmitting(true);

        try {
            const data = {
                email: formData.email,
                username: formData.username,
                firstname: formData.firstname,
                lastname: formData.lastname,
                phone: formData.phone,
                password: formData.password,
                passwordConfirm: formData.password,
                role: "Customer",
            };

            const res = await pb.collection('users').create(data);

            if (res) {
                localStorage.setItem('customerId', JSON.stringify(res.id));
                toast.success('Account created successfully!');
                router.push('/customer/register/profile');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.data?.data) {
                // Handle specific field errors
                const errors = error.data.data;
                if (errors.email) {
                    toast.error('Email is already registered');
                } else if (errors.username) {
                    toast.error('Username is already taken');
                } else {
                    toast.error('Registration failed. Please try again.');
                }
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
            style={{ backgroundImage: 'url("/cargo-ship.png")' }}
        >
            <div className="absolute -z-[1] top-0 left-0 w-full min-h-screen bg-black/60"></div>
            
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-green-700">Green Ocean Logistics</div>
                    <h2 className="text-2xl font-semibold text-green-800 mt-2">Create Customer Account</h2>
                    <p className="text-sm text-gray-600 mt-1">Join our logistics platform</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {progress.map((step, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    index === 0 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {step.n}
                                </div>
                                <span className="text-xs mt-1 text-gray-600">{step.h}</span>
                            </div>
                        ))}
                    </div>
                    <Progress value={25} className="h-2" />
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Username *"
                            value={formData.username}
                            onChange={handleChange('username')}
                            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="First Name *"
                                value={formData.firstname}
                                onChange={handleChange('firstname')}
                                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Last Name *"
                                value={formData.lastname}
                                onChange={handleChange('lastname')}
                                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="tel"
                            placeholder="Phone Number *"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address *"
                            value={formData.email}
                            onChange={handleChange('email')}
                            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password *"
                            value={formData.password}
                            onChange={handleChange('password')}
                            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                            minLength={8}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Confirm Password *"
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!allRequiredFilled || isSubmitting}
                        className={`w-full h-12 rounded-md font-semibold text-lg mt-6 transition flex items-center justify-center gap-2 ${
                            allRequiredFilled && !isSubmitting
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Next <span className="ml-2">&#8594;</span>
                            </>
                        )}
                    </button>

                    {/* Sign In Link */}
                    <p className="mt-6 text-center text-gray-700 text-sm">
                        Already have an account?
                        <a
                            href="/customer/login"
                            className="text-green-600 ml-1 font-medium hover:underline"
                        >
                            Sign In
                        </a>
                    </p>

                    {/* Divider */}
                    <div className="flex items-center w-full my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-3 text-gray-400 text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google Sign In */}
                    <button 
                        type="button"
                        className="mb-6 border border-gray-300 h-12 w-full rounded-md flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition"
                    >
                        <FcGoogle size={22} />
                        <span className="text-base font-medium text-gray-700">Google</span>
                    </button>
                </form>

                {/* Features */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Why choose Green Ocean?</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                            <Package size={14} className="text-green-600" />
                            <span>Container Tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck size={14} className="text-green-600" />
                            <span>Transport Services</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldHalf size={14} className="text-green-600" />
                            <span>Secure Platform</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChartSpline size={14} className="text-green-600" />
                            <span>Real-time Updates</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

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

export default function RegistrationLoginPage() {
    const router = useRouter();

    const progress = [
        { n:1, h: "Login" },
        { n: 2, h: "Business" },
        { n: 3, h: "Account" },
        { n: 4, h: "Completed" },
    ];


    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
    });

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const contactFields = [
        {
            label: 'Username',
            field: 'username',
            placeholder: 'Enter your User name',
            type: 'text',
            icon: <UserRound size={16} className="mr-2" />,
            required: true,
        },
        {
            label: 'First name',
            field: 'firstname',
            placeholder: 'Enter your First name',
            type: 'text',
            icon: <UserRound size={16} className="mr-2" />,
            required: true,
        },
        {
            label: 'Last name',
            field: 'lastname',
            placeholder: 'Enter your last name',
            type: 'text',
            icon: <UserRound size={16} className="mr-2" />,
            required: true,
        },
        {
            label: 'Phone Number',
            field: 'phone',
            placeholder: 'Enter your phone number',
            type: 'text',
            icon: <Phone size={16} className="mr-2" />,
            required: true,
        },
        {
            label: 'Email Address',
            field: 'email',
            placeholder: 'Enter your email address',
            type: 'email',
            icon: <Mail size={16} className="mr-2" />,
            required: true,
        },
        {
            label: 'Password',
            field: 'password',
            placeholder: 'Create a strong password',
            type: 'password',
            icon: <Lock size={16} className="mr-2" />,
            required: true,
            extraNote:
                'Must be at least 8 characters with uppercase, lowercase, and numbers',
        },
        {
            label: 'Confirm Password',
            field: 'confirmPassword',
            placeholder: 'Confirm Your Password',
            type: 'password',
            icon: <Lock size={16} className="mr-2" />,
            required: false,

        },
    ];

    const allRequiredFilled = contactFields
        .filter((f) => f.required)
        .every((f) => formData[f.field] && formData[f.field].trim().length > 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Enter correct password");
            return;
        }
        try {
            const data = {
                email: formData.email,
                username: formData.username,
                firstname: formData.firstname,
                lastname: formData.lastname,
                phone: formData.phone,
                password: formData.password,
                passwordConfirm: formData.password,
                role: "Merchant",
            };



            const res = await pb.collection('users').create(data);

            if(res){
                localStorage.setItem('userId', JSON.stringify(res.id));
                console.log(res.id);
            }

            router.push('/client/Registration/BusinessInfo');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full min-h-screen flex bg-[#F9FAFB]">
            {/* Left Panel */}
            <div className="bg-[#2E6F40] w-1/2  flex flex-col items-center  px-10">
                <img
                    src="/rlogo.png"
                    className="h-70 w-70 rounded-2xl shadow-black shadow-lg mb-8 mt-40"
                />
                <h1 className="text-white font-bold text-3xl mb-4 text-center ">
                    Welcome to Logistics
                </h1>
                <p className="text-white text-center text-lg mb-8 max-w-md">
                    Streamline your logistics operations with our comprehensive management
                    platform. Join thousands of businesses optimizing their supply chain.
                </p>
                <div className="flex items-center justify-center gap-8 mt-4">
                    <div className="flex flex-row items-center">
                        <Truck className="text-white h-7 w-7 mr-1" />
                        <span className="text-white text-sm">Fast Delivery</span>
                    </div>
                    <div className="flex flex-row items-center">
                        <ShieldHalf className="text-white h-7 w-7 mr-1" />
                        <span className="text-white text-sm">Secure</span>
                    </div>
                    <div className="flex flex-row items-center">
                        <ChartSpline className="text-white h-7 w-7 mr-1" />
                        <span className="text-white text-sm">Analytics</span>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col w-1/2 min-h-screen items-center justify-center bg-[#F9FAFB] px-8">
                <div className="flex flex-col items-center w-full max-w-md">
                    
                   
                    <div className="flex justify-between w-full mb-3 mt-5">
                        <h1 className="text-black">Step 1 of 4</h1>
                        <h1 className="text-[#6B7280]">Login</h1>
                    </div>
                    <Progress value={25} className="bg-[#E5E7EB]" />

                    <div className="flex justify-center gap-10 lg:gap-18">
                        {progress.map((prog, idx) => (
                            <div key={idx} className="flex flex-col items-center mt-2">
                                <div className={`w-10 h-10 text-center flex items-center justify-center font-semibold rounded-full ${idx === 0 ? 'bg-[#1B6839] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                                    {prog.n}
                                </div>
                                <div className={`mt-1 text-sm ${idx === 0  ? 'text-[#4B5563]' : 'text-[#9CA3AF]'}`}>{prog.h}</div>
                            </div>
                        ))}
                    </div>
                     <div className="flex items-center mt-5 ">
                        <Package className="text-white bg-[#166534] p-2 h-10 w-10 rounded-lg mr-3" />
                        <span className="text-2xl font-extrabold text-[#1A2E22] ">
                            Logistics
                        </span>
                    </div>
                    <h1 className="font-extrabold text-2xl sm:text-3xl text-center mb-2 text-[#1A2E22] mt-5">
                        Create Your Account
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                        Join our logistics platform and start optimizing your operations
                    </p>

                    {/* Input Fields */}
                    {contactFields.map(
                        ({ label, field, placeholder, type, icon, required, extraNote }) => (
                            <div key={field} className="w-full mb-3">
                                <label className="flex items-center text-gray-500 text-sm font-medium mb-1">
                                    {icon}
                                    {label}
                                    {required &&
                                        (!formData[field] || formData[field].trim() === '') && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                </label>
                                <input
                                    type={type}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange(field)}
                                    placeholder={placeholder}
                                    required={required}
                                    className="border border-gray-300 w-full h-12 rounded-md px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                                />
                                {extraNote && (
                                    <p className="text-xs text-gray-500 mt-1">{extraNote}</p>
                                )}
                            </div>
                        )
                    )}

                    {/* Terms */}
                    <label className="flex items-center space-x-2 mb-4 w-full">
                        <input
                            type="checkbox"
                            className="h-5 w-5 border-gray-400 rounded"
                        />
                        <span className="text-sm text-gray-700">
                            I agree to the
                            <a className="text-blue-600 ml-1 hover:underline cursor-pointer">
                                Terms of Service
                            </a>
                            and
                            <a className="text-blue-600 ml-1 hover:underline cursor-pointer">
                                Privacy Policy
                            </a>
                        </span>
                    </label>

                    {/* Next Button */}
                    <button
                        disabled={!allRequiredFilled}
                        onClick={handleSubmit}
                        className={`w-full h-12 rounded-md font-semibold text-lg mt-2 transition flex items-center justify-center gap-2 text-center ${allRequiredFilled
                            ? 'bg-[#166534] text-white hover:bg-[#14532d]'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        Next <span className="ml-2">&#8594;</span>
                    </button>

                    {/* Sign In */}
                    <p className="mt-6 text-center text-gray-700 text-sm">
                        Already have an account?
                        <a
                            href="#"
                            className="text-blue-600 ml-1 font-medium hover:underline"
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
                    <button className="mb-20 border border-gray-300 h-12 w-full rounded-md flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition">
                        <FcGoogle size={22} />
                        <span className="text-base font-medium text-gray-700">Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import pb from '@/lib/db';
import { useRouter } from 'next/navigation';


import Link from "next/link";

export default function BusinessInfo() {
    const router = useRouter();


    const progress = [
        { n: 1, h: "Login" },
        { n: 2, h: "Business" },
        { n: 3, h: "Account" },
        { n: 4, h: "Completed" },
    ];

    const [formData, setFormData] = useState({
        businessName: '',
        gstin: '',
        pan: '',
        address: '',
    });



    const isFormComplete = () => {
        const { businessName, pan } = formData;
        return (
            businessName.trim() &&
            pan.trim()
        );
    }

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const isEmpty = (value) => (typeof value === 'string' ? value.trim() === '' : true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('User not logged in.');
                return;
            }
            const data = {
                address: formData.address,
                businessName: formData.businessName,
                gstIn: formData.gstin,
                panNo: formData.pan,
                user: JSON.parse(userId),

            };
            await pb.collection('user_profile').create(data);
            router.push('/client/Registration/AccountSetup');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="hidden bg-[linear-gradient(to_right,#1B6838,#3B7D54)] w-1/2 lg:flex flex-col justify-center items-center">
                <Rocket size={50} className="text-white" />
                <h1 className="text-white font-semibold text-2xl mt-5">Welcome to BusinessHub</h1>
                <p className="text-white/80 pl-40 pr-40 mt-5 text-center">Streamline your business registration process with our simple, secure, and efficient platform.</p>
            </div>

            <div className="bg-white w-full lg:w-1/2 h-full overflow-y-auto">
                <div className="px-6 sm:px-10 lg:px-20 xl:px-40 mt-5 w-full max-w-screen-md mx-auto">

                    <div className="flex justify-between mb-3">
                        <h1 className="text-black">Step 1 of 4</h1>
                        <h1 className="text-[#6B7280]">Business Info</h1>
                    </div>
                    <Progress value={50} className="bg-[#E5E7EB]" />

                    <div className="flex justify-center gap-10 lg:gap-18">
                        {progress.map((prog, idx) => (
                            <div key={idx} className="flex flex-col items-center mt-2">
                                <div className={`w-10 h-10 text-center flex items-center justify-center font-semibold rounded-full ${idx === 0 || idx === 1? 'bg-[#1B6839] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                                    {prog.n}
                                </div>
                                <div className={`mt-1 text-sm ${idx === 0 || idx === 1 ? 'text-[#4B5563]' : 'text-[#9CA3AF]'}`}>{prog.h}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#FDFDFD] flex flex-col justify-center items-center p-7 shadow-md mt-10">
                        <h1 className="text-2xl text-black font-semibold">Business Information</h1>
                        <p className="text-[#4B5563] mt-2 mb-5">Please provide your business details to get started</p>

                        <div className="flex flex-col gap-2 w-full">
                            {[
                                { label: 'Business Name', field: 'businessName', placeholder: 'Enter your Business name', required: true },
                                { label: 'GSTIN', field: 'gstin', placeholder: 'Enter GSTIN (if available)', required: false },
                                { label: 'Pan Number', field: 'pan', placeholder: 'Enter PAN number', required: true },
                                { label: 'Address', field: 'address', placeholder: 'Enter Address', required: true },
                            ].map(({ label, field, placeholder, required }) => (
                                <div key={field}>
                                    <label className="text-[#374151] ml-2 text-sm">
                                        {label}
                                        {required && isEmpty(formData[field]) && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={handleChange(field)}
                                        required={required}
                                        className="bg-white h-10 w-full mt-1 mb-2 border border-[#D1D5DB] rounded-md p-2 placeholder:text-[#ADAEBC]"
                                        placeholder={placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                        



                        {isFormComplete() ? (
                            <Link href="/client/Registration/AccountSetup">
                                <button onClick={handleSubmit} className="h-9 w-25 flex justify-center items-center rounded-sm gap-1 bg-[#1B6839] text-white ">
                                    Next <ArrowRight size={18} />
                                </button>
                            </Link>
                        ) : (
                            <button type="submit"
                                className="h-9 w-25 flex justify-center items-center rounded-sm gap-1 bg-gray-300 text-gray-500 cursor-not-allowed"
                                disabled
                            >
                                Next <ArrowRight size={18} />
                            </button>
                        )}
                    </div>



                    <p className="mt-5 text-[#6B7280] text-center">
                        Already have an account?
                        <a className="text-[#1B6839] ml-1 cursor-pointer">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}  
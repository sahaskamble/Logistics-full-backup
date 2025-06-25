'use client';
import { useState } from 'react';
import { UserPlus, ArrowRight, CloudUpload, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import pb from '@/lib/db';
import { useRouter } from 'next/navigation';


export default function AccountSetup() {
        const router = useRouter();


    const [agreed, setAgreed] = useState(false);


    const progress = [
        { n:1, h: "Login" },
        { n: 2, h: "Business" },
        { n: 3, h: "Account" },
        { n: 4, h: "Completed" },
    ];

    const [formData, setFormData] = useState({
        documents: []
    });




    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('User not logged in.');
                return;
            }
            const form = new FormData();
            form.append('user', JSON.parse(userId));
            formData.documents.forEach((doc, index) => {
                form.append('documents', doc.file);
            });
            await pb.collection('user_profile').create(form);
            router.push('/client/Registration/Success');

        } catch (error) {
            console.error(error);
        }
    }

    const handleFileUpload = (label) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, documents: [...formData.documents, { file, label }] });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="hidden bg-[linear-gradient(to_right,#1B6838,#3B7D54)] w-1/2 lg:flex flex-col justify-center items-center">
                <UserPlus size={50} className="text-white" />
                <h1 className="text-white font-semibold text-2xl mt-5">Account Setup</h1>
                <p className="text-white/80 pl-40 pr-40 mt-5 text-center">To create your account, check your Details </p>
            </div>

            <div className="bg-white w-full lg:w-1/2 h-full overflow-y-auto">
                <div className="px-6 sm:px-10 lg:px-20 xl:px-40 mt-5 w-full max-w-screen-md mx-auto">

                    <div className="flex justify-between mb-3">
                        <h1 className="text-black">Step 4 of 4</h1>
                        <h1 className="text-[#6B7280]">Account Setup</h1>
                    </div>
                    <Progress value={75} className="bg-[#E5E7EB]" />

                    <div className="flex justify-center gap-10 lg:gap-18">
                        {progress.map((prog, idx) => (
                            <div key={idx} className="flex flex-col items-center mt-2">
                                <div className={`w-10 h-10 text-center flex items-center justify-center font-semibold rounded-full ${idx === 0 || idx === 1 || idx === 2? 'bg-[#1B6839] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                                    {prog.n}
                                </div>
                                <div className={`mt-1 text-sm ${idx === 0 || idx === 1 || idx === 2 ? 'text-[#4B5563]' : 'text-[#9CA3AF]'}`}>{prog.h}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#FDFDFD] flex flex-col justify-center items-center p-7 shadow-md mt-10">
                        <h1 className="text-2xl text-black font-semibold">Create Your Account</h1>
                        <p className="text-[#4B5563] mt-2 mb-5 text-center">Set up your credentials and upload required documents</p>

                        <div className="flex flex-col gap-2 w-full">

                            {["License", "GST Certificate", "ID Proof"].map((label) => (
                                <div key={label} className="mt-4">
                                    <label className="text-[#374151] text-sm font-medium w-full">
                                        Upload {label} <span className="text-red-500 ml-1">*</span>
                                    </label>

                                    <div className="w-full mt-1 border border-dashed border-[#D1D5DB] h-28 rounded-md flex justify-center items-center transition hover:border-[#1B6839]">
                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-[#6B7280] text-sm">
                                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload(label)} />
                                            <CloudUpload className="text-[#9CA3AF] mb-1" size={28} />
                                            <span className="text-sm">Click to upload or drag and drop</span>
                                        </label>
                                    </div>
                                </div>
                            ))}

                            {formData.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between mt-3 p-2 border rounded-md">
                                    <span className="text-sm text-[#374151] truncate w-4/5">
                                        {doc.label}: {doc.file.name}
                                    </span>
                                    <button
                                        type="button" className="text-red-500 text-xs"
                                        onClick={() => {
                                            const updated = [...formData.documents];
                                            updated.splice(index, 1);
                                            setFormData({ ...formData, documents: updated });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                        </div>


                        <div className="flex items-start space-x-2 mt-4">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 accent-[#1B6839]"

                                onChange={(e) => setAgreed(e.target.checked)}
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-[#374151]">
                                I agree to the <a href="#" className="text-[#1B6839] underline">Terms of Service</a> and <a href="#" className="text-[#1B6839] underline">Privacy Policy</a>
                            </label>
                        </div>
                        <div className="flex gap-10 mt-5">
                            <Link href="/client/Registration/AddressInfo">

                                <button className="text-[#4B5563] border h-9 w-40 flex justify-center items-center rounded-sm gap-1" ><ArrowLeft size={18} />Back</button>
                            </Link>
                            <Link href="/client/Registration/Success">
                                <button onClick={handleSubmit}
                                    className={`h-9 w-40 flex justify-center items-center rounded-sm gap-1 ${agreed ? 'bg-[#1B6839] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Submit<ArrowRight size={18} /></button>
                            </Link>
                        </div>
                    </div>


                </div>
            </div>
        </div>

    );
}  
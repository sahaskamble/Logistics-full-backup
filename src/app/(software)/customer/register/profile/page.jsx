'use client';
import { Progress } from "@/components/ui/progress";
import { Building, MapPin, FileText, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import pb from '@/lib/db';
import { toast } from 'sonner';

export default function CustomerProfilePage() {
    const router = useRouter();

    const progress = [
        { n: 1, h: "Register" },
        { n: 2, h: "Profile" },
        { n: 3, h: "Verification" },
        { n: 4, h: "Completed" },
    ];

    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        businessType: '',
        description: '',
        documents: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const businessTypes = [
        'Import/Export',
        'Manufacturing',
        'Retail',
        'Wholesale',
        'E-commerce',
        'Trading',
        'Other'
    ];

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newDocuments = files.map(file => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type
        }));
        
        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, ...newDocuments]
        }));
    };

    const removeDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Check if required fields are filled
    const requiredFieldsFilled = 
        formData.companyName.trim() !== '' &&
        formData.address.trim() !== '' &&
        formData.businessType !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!requiredFieldsFilled) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const customerId = localStorage.getItem('customerId');
            if (!customerId) {
                toast.error('Session expired. Please register again.');
                router.push('/customer/register');
                return;
            }

            const form = new FormData();
            form.append('user', JSON.parse(customerId));
            form.append('businessName', formData.companyName);
            form.append('address', formData.address);
            form.append('businessType', formData.businessType);
            if (formData.description) {
                form.append('contact', formData.description); // Using contact field for description
            }

            // Add documents
            formData.documents.forEach((doc) => {
                form.append('documents', doc.file);
            });

            await pb.collection('user_profile').create(form);
            toast.success('Profile created successfully!');
            router.push('/customer/register/verification');

        } catch (error) {
            console.error('Profile creation error:', error);
            toast.error('Failed to create profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        router.push('/customer/register/verification');
    };

    return (
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
            style={{ backgroundImage: 'url("/cargo-ship.png")' }}
        >
            <div className="absolute -z-[1] top-0 left-0 w-full min-h-screen bg-black/60"></div>
            
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-green-700">Green Ocean Logistics</div>
                    <h2 className="text-2xl font-semibold text-green-800 mt-2">Business Profile</h2>
                    <p className="text-sm text-gray-600 mt-1">Tell us about your business</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {progress.map((step, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    index <= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {step.n}
                                </div>
                                <span className="text-xs mt-1 text-gray-600">{step.h}</span>
                            </div>
                        ))}
                    </div>
                    <Progress value={50} className="h-2" />
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Name */}
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Company/Business Name *"
                            value={formData.companyName}
                            onChange={handleChange('companyName')}
                            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Business Type */}
                    <div className="relative">
                        <select
                            value={formData.businessType}
                            onChange={handleChange('businessType')}
                            className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            required
                        >
                            <option value="">Select Business Type *</option>
                            {businessTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Address */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-4 text-gray-400" size={20} />
                        <textarea
                            placeholder="Business Address *"
                            value={formData.address}
                            onChange={handleChange('address')}
                            rows={3}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="relative">
                        <FileText className="absolute left-3 top-4 text-gray-400" size={20} />
                        <textarea
                            placeholder="Business Description (Optional)"
                            value={formData.description}
                            onChange={handleChange('description')}
                            rows={4}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Document Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Documents (Optional)
                        </label>
                        
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <div className="text-sm text-gray-600 mb-2">
                                <label htmlFor="documents" className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
                                    Click to upload
                                </label>
                                <span> or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Business license, GST certificate, etc. (PDF, JPG, PNG up to 10MB each)
                            </p>
                            <input
                                id="documents"
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Uploaded Documents */}
                        {formData.documents.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
                                {formData.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <FileText size={16} className="text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition"
                        >
                            Skip for Now
                        </button>
                        <button
                            type="submit"
                            disabled={!requiredFieldsFilled || isSubmitting}
                            className={`flex-1 h-12 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                                requiredFieldsFilled && !isSubmitting
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue <span className="ml-2">&#8594;</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

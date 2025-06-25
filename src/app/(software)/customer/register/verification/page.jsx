'use client';
import { Progress } from "@/components/ui/progress";
import { Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function CustomerVerificationPage() {
    const router = useRouter();
    const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verified, failed
    const [userEmail, setUserEmail] = useState('');

    const progress = [
        { n: 1, h: "Register" },
        { n: 2, h: "Profile" },
        { n: 3, h: "Verification" },
        { n: 4, h: "Completed" },
    ];

    useEffect(() => {
        // Get user email from localStorage or context
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
            router.push('/customer/register');
            return;
        }

        // In a real app, you would fetch user details here
        // For demo purposes, we'll simulate verification
        setUserEmail('customer@example.com');
        
        // Simulate verification process
        const timer = setTimeout(() => {
            setVerificationStatus('verified');
            toast.success('Email verified successfully!');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    const handleContinue = () => {
        localStorage.removeItem('customerId'); // Clean up
        router.push('/customer/register/success');
    };

    const handleResendEmail = () => {
        toast.info('Verification email sent!');
        setVerificationStatus('pending');
    };

    const getStatusIcon = () => {
        switch (verificationStatus) {
            case 'verified':
                return <CheckCircle className="text-green-500" size={48} />;
            case 'failed':
                return <AlertCircle className="text-red-500" size={48} />;
            default:
                return <Clock className="text-yellow-500" size={48} />;
        }
    };

    const getStatusMessage = () => {
        switch (verificationStatus) {
            case 'verified':
                return {
                    title: 'Email Verified!',
                    message: 'Your email has been successfully verified. You can now continue to complete your registration.',
                    color: 'text-green-600'
                };
            case 'failed':
                return {
                    title: 'Verification Failed',
                    message: 'We couldn\'t verify your email. Please try again or contact support.',
                    color: 'text-red-600'
                };
            default:
                return {
                    title: 'Verify Your Email',
                    message: 'We\'ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.',
                    color: 'text-yellow-600'
                };
        }
    };

    const status = getStatusMessage();

    return (
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
            style={{ backgroundImage: 'url("/cargo-ship.png")' }}
        >
            <div className="absolute -z-[1] top-0 left-0 w-full min-h-screen bg-black/60"></div>
            
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-green-700">Green Ocean Logistics</div>
                    <h2 className="text-2xl font-semibold text-green-800 mt-2">Email Verification</h2>
                    <p className="text-sm text-gray-600 mt-1">Almost there!</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {progress.map((step, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    index <= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {step.n}
                                </div>
                                <span className="text-xs mt-1 text-gray-600">{step.h}</span>
                            </div>
                        ))}
                    </div>
                    <Progress value={75} className="h-2" />
                </div>

                {/* Verification Status */}
                <div className="text-center mb-8">
                    <div className="mb-4 flex justify-center">
                        {getStatusIcon()}
                    </div>
                    
                    <h3 className={`text-xl font-semibold mb-2 ${status.color}`}>
                        {status.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                        {status.message}
                    </p>

                    {userEmail && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                <Mail size={16} />
                                <span>{userEmail}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {verificationStatus === 'verified' ? (
                        <button
                            onClick={handleContinue}
                            className="w-full h-12 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            Continue <span className="ml-2">&#8594;</span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleResendEmail}
                                className="w-full h-12 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
                            >
                                Resend Verification Email
                            </button>
                            
                            <button
                                onClick={() => router.push('/customer/register/success')}
                                className="w-full h-12 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition"
                            >
                                Skip Verification
                            </button>
                        </>
                    )}
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button 
                            onClick={handleResendEmail}
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            try again
                        </button>
                    </p>
                </div>

                {/* Loading Animation for Pending */}
                {verificationStatus === 'pending' && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

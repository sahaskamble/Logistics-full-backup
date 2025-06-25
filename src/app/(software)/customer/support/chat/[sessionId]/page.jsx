'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SupportChat from '@/components/support/SupportChat';
import { toast } from 'sonner';

/**
 * Support Chat Page
 * Displays the support chat interface for a specific session
 */
export default function SupportChatPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and authorized
    if (!authLoading) {
      if (!user) {
        toast.error('Please log in to access support chat');
        router.push('/login');
        return;
      }

      // Check if user has access to this chat session
      // This will be validated by the chat service as well
      setIsAuthorized(true);
      setChecking(false);
    }
  }, [user, authLoading, router]);

  const handleCloseChat = () => {
    // Close the window if opened in popup, otherwise redirect
    if (window.opener) {
      window.close();
    } else {
      router.back();
    }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading support chat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this chat session.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Green Ocean Logistics - Support Chat
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username || user?.email}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-full mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)]">
          <SupportChat 
            sessionId={sessionId} 
            onClose={handleCloseChat}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-500">
          <p>
            Green Ocean Logistics Support Chat • Session ID: {sessionId} • 
            Secure & Encrypted Communication
          </p>
        </div>
      </div>
    </div>
  );
}

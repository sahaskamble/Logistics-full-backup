'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/constants/roles';
import { MessageCircle, HelpCircle, Users } from 'lucide-react';

/**
 * Support Button Component
 * Provides quick access to support features based on user role
 */
export default function SupportButton({ className = '' }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const isAgent = [ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT].includes(user.role);
  const isCustomer = [ROLES.CUSTOMER, ROLES.MERCHANT].includes(user.role);

  const handleSupportClick = () => {
    if (isAgent) {
      router.push('/gol/support');
    } else if (isCustomer) {
      router.push('/support');
    }
  };

  const handleDropdownClick = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Simple button for mobile or when dropdown not needed */}
      <button
        onClick={handleSupportClick}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
        title={isAgent ? 'Support Dashboard' : 'Get Support'}
      >
        {isAgent ? (
          <>
            <Users className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Support Dashboard</span>
            <span className="sm:hidden">Support</span>
          </>
        ) : (
          <>
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Get Support</span>
            <span className="sm:hidden">Support</span>
          </>
        )}
      </button>

      {/* Dropdown for desktop with more options */}
      <div className="hidden lg:block relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          {isAgent ? (
            <>
              <Users className="w-4 h-4 mr-2" />
              Support Dashboard
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 mr-2" />
              Support
            </>
          )}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {isAgent ? (
                  <>
                    <button
                      onClick={() => handleDropdownClick('/gol/support')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="w-4 h-4 mr-3" />
                      Support Dashboard
                    </button>
                    <button
                      onClick={() => handleDropdownClick('/gol/support')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Manage Chats
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDropdownClick('/support')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Start New Chat
                    </button>
                    <button
                      onClick={() => handleDropdownClick('/support')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <HelpCircle className="w-4 h-4 mr-3" />
                      View My Chats
                    </button>
                  </>
                )}
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500">
                    {isAgent ? 'Manage customer support' : 'Get help from our team'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

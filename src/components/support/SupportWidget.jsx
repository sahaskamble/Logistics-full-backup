'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { ROLES } from '@/constants/roles';
import { 
  MessageCircle, 
  X, 
  Plus, 
  Clock, 
  CheckCircle,
  Users,
  ArrowRight
} from 'lucide-react';

/**
 * Floating Support Widget
 * Provides quick access to support features from any page
 */
export default function SupportWidget() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserChatSessions, createChatSession } = useChat();
  
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const isAgent = user && [ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT].includes(user.role);
  const isCustomer = user && [ROLES.CUSTOMER, ROLES.MERCHANT].includes(user.role);

  // Load recent sessions when widget opens
  useEffect(() => {
    if (isOpen && user && isCustomer) {
      loadRecentSessions();
    }
  }, [isOpen, user, isCustomer]);

  const loadRecentSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSessions = await getUserChatSessions();
      // Show only the 3 most recent sessions
      setSessions(userSessions.slice(0, 3));
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewChat = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setCreating(true);
    try {
      const session = await createChatSession();
      if (session) {
        router.push(`/support/chat/${session.id}`);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error creating chat session:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenChat = (sessionId) => {
    router.push(`/support/chat/${sessionId}`);
    setIsOpen(false);
  };

  const handleViewAllSupport = () => {
    if (isAgent) {
      router.push('/gol/support');
    } else {
      router.push('/support');
    }
    setIsOpen(false);
  };

  const getSessionStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'Close':
        return <Clock className="w-3 h-3 text-gray-400" />;
      default:
        return <Clock className="w-3 h-3 text-yellow-500" />;
    }
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Don't show widget if user is not logged in or on support pages
  if (!user || window.location.pathname.startsWith('/support')) {
    return null;
  }

  return (
    <>
      {/* Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
          title={isAgent ? 'Support Dashboard' : 'Get Support'}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : isAgent ? (
            <Users className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {isAgent ? 'Support Dashboard' : 'Need Help?'}
                </h3>
                <p className="text-sm opacity-90">
                  {isAgent ? 'Manage customer support' : 'Chat with our support team'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {isAgent ? (
              /* Agent View */
              <div className="space-y-3">
                <button
                  onClick={handleViewAllSupport}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium text-blue-900">Open Support Dashboard</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Manage customer chats and support requests</p>
                </div>
              </div>
            ) : (
              /* Customer View */
              <div className="space-y-4">
                {/* Start New Chat */}
                <button
                  onClick={handleStartNewChat}
                  disabled={creating}
                  className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Chat
                    </>
                  )}
                </button>

                {/* Recent Sessions */}
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                ) : sessions.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Chats</h4>
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => handleOpenChat(session.id)}
                          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            {getSessionStatusIcon(session.status)}
                            <div className="ml-2 min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Chat Session
                              </p>
                              <p className="text-xs text-gray-500">
                                {getTimeSince(session.created)}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* View All */}
                <button
                  onClick={handleViewAllSupport}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
                >
                  View All Support Options →
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-3 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-600 text-center">
              {isAgent 
                ? 'Manage customer support efficiently' 
                : 'Available 24/7 • Response within minutes'
              }
            </p>
          </div>
        </div>
      )}
    </>
  );
}

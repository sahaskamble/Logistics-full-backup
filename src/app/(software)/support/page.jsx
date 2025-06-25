'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { useTicket } from '@/hooks/useTicket';
import { ROLES } from '@/constants/roles';
import { toast } from 'sonner';
import {
  MessageCircle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Ticket,
  FileText
} from 'lucide-react';

/**
 * Main Support Page
 * Allows customers to start new chats and view existing sessions
 * Redirects agents to the agent dashboard
 */
export default function SupportPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createChatSession, getUserChatSessions } = useChat();
  const { createTicket } = useTicket();
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketContent, setTicketContent] = useState('');

  // Load user's chat sessions
  const loadSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSessions = await getUserChatSessions();
      setSessions(userSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Please log in to access support');
        router.push('/login');
        return;
      }

      // Redirect agents to agent dashboard
      if ([ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT].includes(user.role)) {
        router.push('/gol/support');
        return;
      }

      loadSessions();
    }
  }, [user, authLoading, router]);

  const handleStartNewChat = async () => {
    if (!user) {
      toast.error('Please log in to start a chat session');
      return;
    }

    if (!user.id) {
      toast.error('Invalid user session. Please log in again.');
      return;
    }

    console.log('Starting new chat for user:', user);

    setCreating(true);
    try {
      const session = await createChatSession();
      if (session) {
        toast.success('New chat session created!');
        router.push(`/support/chat/${session.id}`);
      } else {
        toast.error('Failed to create chat session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast.error('Failed to create chat session. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenChat = (sessionId) => {
    router.push(`/support/chat/${sessionId}`);
  };

  const handleCreateTicket = async () => {
    if (!user) {
      toast.error('Please log in to create a ticket');
      return;
    }

    if (!ticketContent.trim()) {
      toast.error('Please provide a description for your ticket');
      return;
    }

    setCreating(true);
    try {
      const ticket = await createTicket(ticketContent);
      if (ticket) {
        toast.success('Ticket created successfully!');
        setTicketContent('');
        setShowTicketForm(false);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getSessionStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Close':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent shadow-sm border-b border-primary/20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Support Center</h1>
              <p className="text-foreground/70">Get help from our support team</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground/70">
                Welcome, {user?.username || user?.email}
              </span>
              <span className="px-2 py-1 bg-primary text-accent text-xs rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Start New Chat Section */}
            <div className="bg-accent rounded-lg shadow-sm border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Start New Chat</h2>
                  <p className="text-foreground/70">Connect with our support team instantly</p>
                </div>
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>

              <button
                onClick={handleStartNewChat}
                disabled={creating || !user}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary text-accent rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                    Creating Chat...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Chat Session
                  </>
                )}
              </button>
            </div>

            {/* Create Ticket Section */}
            <div className="bg-accent rounded-lg shadow-sm border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Need More Help?</h2>
                  <p className="text-foreground/70">Create a ticket for complex issues or manage existing ones</p>
                </div>
                <Ticket className="w-8 h-8 text-primary" />
              </div>

              {!showTicketForm ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-accent rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Create Support Ticket
                  </button>

                  <button
                    onClick={() => window.location.href = '/tickets'}
                    className="w-full flex items-center justify-center px-4 py-3 border border-primary/30 text-foreground rounded-lg hover:bg-background/50 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View My Tickets
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={ticketContent}
                    onChange={(e) => setTicketContent(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full p-3 border border-primary/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateTicket}
                      disabled={creating || !ticketContent.trim()}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-accent rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4 mr-2" />
                          Create Ticket
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowTicketForm(false);
                        setTicketContent('');
                      }}
                      className="px-4 py-2 bg-background text-foreground border border-primary/30 rounded-lg hover:bg-background/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Sessions */}
            <div className="bg-accent rounded-lg shadow-sm border border-primary/20">
              <div className="p-6 border-b border-primary/20">
                <h2 className="text-lg font-semibold text-foreground">Your Chat Sessions</h2>
                <p className="text-foreground/70">View and continue your previous conversations</p>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-foreground/70">Loading chat sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No chat sessions yet</h3>
                  <p className="text-gray-600 mb-4">Start your first conversation with our support team</p>
                  <button
                    onClick={handleStartNewChat}
                    disabled={creating}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Chat
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sessions.map((session) => {
                    const sessionAgent = session.expand?.agent || {};
                    
                    return (
                      <div
                        key={session.id}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleOpenChat(session.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              {getSessionStatusIcon(session.status)}
                              <span className="font-medium text-gray-900">
                                Chat Session
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                session.status === 'Open' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {session.status}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Session ID: {session.id}</p>
                              <p>Created: {getTimeSince(session.created)}</p>
                              {session.agent && (
                                <p>Agent: {sessionAgent.username || 'Assigned'}</p>
                              )}
                              {session.status === 'Close' && session.closed_at && (
                                <p>Closed: {getTimeSince(session.closed_at)}</p>
                              )}
                            </div>
                          </div>
                          
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Help */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Quick Help</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">
                  Our support team is available 24/7 to help you with:
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Order tracking and updates</li>
                  <li>• Shipping and logistics queries</li>
                  <li>• Account and billing support</li>
                  <li>• Technical assistance</li>
                  <li>• General inquiries</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+91-1234567890</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@greenoceanlogistics.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">+91-9876543210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Business Hours</h3>
              <p className="text-sm text-blue-800">
                Our support team is available 24/7 for live chat and emergency support.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Phone support: Monday - Friday, 9 AM - 6 PM IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Search, Filter, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import customerClientChatService from '@/services/customerClientChatService';
import ChatSessionList from './components/ChatSessionList';
import ChatWindow from './components/ChatWindow';
import NewChatModal from './components/NewChatModal';
import { toast } from 'sonner';

export default function CustomerChatPage() {
  const { user } = useAuth();
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, closed
  const [unreadCount, setUnreadCount] = useState(0);

  // Load chat sessions on component mount
  useEffect(() => {
    if (user) {
      loadChatSessions();
      loadUnreadCount();
    }
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (selectedSession) {
      const handleNewMessage = (event) => {
        if (event.action === 'create') {
          // Refresh the selected session to show new message
          loadSelectedSession(selectedSession.id);
          // Refresh sessions list to update last message
          loadChatSessions();
        }
      };

      const handleSessionUpdate = (event) => {
        // Refresh sessions list when session is updated
        loadChatSessions();
      };

      customerClientChatService.subscribeToChat(
        selectedSession.id,
        handleNewMessage,
        handleSessionUpdate
      );

      return () => {
        customerClientChatService.unsubscribeFromChat();
      };
    }
  }, [selectedSession]);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      const sessions = await customerClientChatService.getChatSessions(user.id, 'customer');
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast.error('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await customerClientChatService.getUnreadMessageCount(user.id, 'customer');
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadSelectedSession = async (sessionId) => {
    try {
      const sessionData = await customerClientChatService.getChatSession(sessionId, user.id);
      setSelectedSession(sessionData);
      
      // Mark messages as read
      await customerClientChatService.markMessagesAsRead(sessionId, user.id);
      loadUnreadCount();
    } catch (error) {
      console.error('Error loading selected session:', error);
      toast.error('Failed to load chat session');
    }
  };

  const handleSessionSelect = (session) => {
    loadSelectedSession(session.id);
  };

  const handleNewChat = async (clientId, subject, serviceType) => {
    try {
      const newSession = await customerClientChatService.createChatSession(
        user.id,
        clientId,
        subject,
        serviceType
      );
      
      setShowNewChatModal(false);
      loadChatSessions();
      loadSelectedSession(newSession.id);
      toast.success('New chat started successfully');
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to start new chat');
    }
  };

  const handleSendMessage = async (content, attachment) => {
    if (!selectedSession) return;

    try {
      await customerClientChatService.sendMessage(
        selectedSession.session.id,
        user.id,
        content,
        attachment
      );
      
      // Refresh the session to show new message
      loadSelectedSession(selectedSession.session.id);
      loadChatSessions();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Filter chat sessions based on search and status
  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.expand?.client?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.expand?.client?.lastname?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && session.status === 'Active') ||
      (filterStatus === 'closed' && session.status === 'Closed');
    
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to access chat</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Chat Sessions */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-blue-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Start new chat"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Chats</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSessions.length > 0 ? (
            <ChatSessionList
              sessions={filteredSessions}
              selectedSession={selectedSession?.session}
              onSessionSelect={handleSessionSelect}
              currentUserId={user.id}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Users size={48} className="mb-2 opacity-50" />
              <p className="text-sm">No conversations found</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="text-blue-600 text-sm mt-2 hover:underline"
              >
                Start your first chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <ChatWindow
            session={selectedSession.session}
            messages={selectedSession.messages}
            currentUser={user}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 mb-4">
                Choose a conversation from the sidebar to start messaging
              </p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={handleNewChat}
        />
      )}
    </div>
  );
}

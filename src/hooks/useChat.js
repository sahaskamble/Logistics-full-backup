import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '@/services/chatService';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/constants/roles';
import { toast } from 'sonner';

/**
 * Custom hook for managing chat functionality
 * Handles chat sessions, messages, and real-time updates
 */
export function useChat(sessionId = null) {
  const { user } = useAuth();
  const [chatSession, setChatSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  // Refs for cleanup
  const subscriptionRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /**
   * Create a new chat session
   */
  const createChatSession = useCallback(async () => {
    if (!user) {
      setError('User must be authenticated to create chat session');
      toast.error('Please log in to create a chat session');
      return null;
    }

    if (!user.id) {
      setError('Invalid user data - missing user ID');
      toast.error('Invalid user session. Please log in again.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating chat session for user:', { id: user.id, role: user.role });
      const session = await chatService.createChatSession(user.id, user.role);
      setChatSession(session);
      setIsConnected(true);

      // Start listening for updates
      subscribeToUpdates(session.id);

      toast.success('Chat session created successfully');
      return session;
    } catch (err) {
      console.error('Chat session creation error:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);

      // Provide more specific error messages
      if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
        toast.error('Authentication error. Please log in again.');
      } else if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        toast.error('Access denied. Please check your permissions.');
      } else {
        toast.error('Failed to create chat session: ' + errorMessage);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Load an existing chat session
   */
  const loadChatSession = useCallback(async (id) => {
    if (!user || !id) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Loading chat session:', { id, userId: user.id, userRole: user.role });
      const { session, messages: sessionMessages } = await chatService.getChatSession(id, user.id);
      console.log('Chat session loaded successfully:', session);
      setChatSession(session);
      setMessages(sessionMessages);
      setIsConnected(true);

      // Start listening for updates
      subscribeToUpdates(id);
    } catch (err) {
      console.error('Failed to load chat session:', err);
      setError(err.message);
      toast.error('Failed to load chat session: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Send a message in the current chat session
   */
  const sendMessage = useCallback(async (content, attachment = null) => {
    if (!chatSession || !user) return;

    // Allow sending if there's either content or attachment
    if (!content.trim() && !attachment) return;

    try {
      console.log('Sending message:', { content: content.trim(), attachment, sessionId: chatSession.id, userId: user.id });

      const message = await chatService.sendMessage(
        chatSession.id,
        user.id,
        content.trim() || '', // Allow empty content if there's an attachment
        attachment
      );

      console.log('Message sent successfully:', message);

      // Optimistically add message to local state
      setMessages(prev => [...prev, {
        ...message,
        sender: user,
        expand: { sender: user }
      }]);

      return message;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      toast.error('Failed to send message: ' + err.message);
      throw err;
    }
  }, [chatSession, user]);

  /**
   * Close the current chat session
   */
  const closeChatSession = useCallback(async () => {
    if (!chatSession || !user) return;

    try {
      await chatService.closeChatSession(chatSession.id, user.id);
      setChatSession(prev => prev ? { ...prev, status: 'Close' } : null);
      setIsConnected(false);
      
      // Clean up subscriptions
      if (subscriptionRef.current) {
        chatService.unsubscribeFromChat();
        subscriptionRef.current = null;
      }
      
      toast.success('Chat session closed');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to close chat session: ' + err.message);
    }
  }, [chatSession, user]);

  /**
   * Subscribe to real-time chat updates
   */
  const subscribeToUpdates = useCallback((sessionId) => {
    if (subscriptionRef.current) {
      chatService.unsubscribeFromChat();
    }

    const onMessage = (event) => {
      if (event.action === 'create') {
        // Add new message to state if it's not from current user (to avoid duplicates)
        if (event.record.sender !== user?.id) {
          setMessages(prev => {
            // Check if message already exists
            const exists = prev.some(msg => msg.id === event.record.id);
            if (!exists) {
              return [...prev, event.record];
            }
            return prev;
          });
        }
      } else if (event.action === 'update') {
        // Update existing message
        setMessages(prev => prev.map(msg => 
          msg.id === event.record.id ? event.record : msg
        ));
      } else if (event.action === 'delete') {
        // Remove deleted message
        setMessages(prev => prev.filter(msg => msg.id !== event.record.id));
      }
    };

    const onSessionUpdate = (event) => {
      if (event.action === 'update') {
        setChatSession(prev => prev ? { ...prev, ...event.record } : event.record);
        
        // If session was closed, disconnect
        if (event.record.status === 'Close') {
          setIsConnected(false);
        }
      }
    };

    chatService.subscribeToChat(sessionId, onMessage, onSessionUpdate);
    subscriptionRef.current = sessionId;
  }, [user]);

  /**
   * Handle typing indicators
   */
  const handleTyping = useCallback((isTyping) => {
    if (!chatSession || !user) return;

    // This is a simplified typing indicator
    // In a full implementation, you'd send typing events to other participants
    if (isTyping) {
      setTypingUsers(prev => new Set([...prev, user.id]));
      
      // Clear typing after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(user.id);
          return newSet;
        });
      }, 3000);
    } else {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(user.id);
        return newSet;
      });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  }, [chatSession, user]);

  /**
   * Get user's chat sessions (simplified)
   */
  const getUserChatSessions = useCallback(async () => {
    if (!user) return [];

    try {
      return await chatService.getUserChatSessions(user.id);
    } catch (err) {
      console.error('Error loading chat sessions:', err);
      setError(err.message);
      // Don't show error toast - just return empty array
      return [];
    }
  }, [user]);

  /**
   * Get all chat sessions for agents
   */
  const getAllChatSessions = useCallback(async () => {
    if (!user) return [];

    try {
      return await chatService.getAllChatSessions();
    } catch (err) {
      console.error('Error loading all chat sessions:', err);
      setError(err.message);
      return [];
    }
  }, [user]);

  /**
   * Assign agent to a chat session
   */
  const assignAgentToSession = useCallback(async (sessionId, agentId = null) => {
    if (!user) return null;

    try {
      const actualAgentId = agentId || user.id;
      const updatedSession = await chatService.assignAgentToSession(sessionId, actualAgentId);
      toast.success('Successfully assigned to chat session');
      return updatedSession;
    } catch (err) {
      console.error('Error assigning agent to session:', err);
      toast.error('Failed to assign agent to session');
      return null;
    }
  }, [user]);

  /**
   * Search FAQs
   */
  const searchFAQs = useCallback(async (query) => {
    try {
      return await chatService.searchFAQs(query);
    } catch (err) {
      console.error('Failed to search FAQs:', err);
      return [];
    }
  }, []);

  // Load chat session on mount if sessionId is provided
  useEffect(() => {
    if (sessionId && user) {
      loadChatSession(sessionId);
    }
  }, [sessionId, user, loadChatSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        chatService.unsubscribeFromChat();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    chatSession,
    messages,
    loading,
    error,
    isConnected,
    typingUsers,
    
    // Actions
    createChatSession,
    loadChatSession,
    sendMessage,
    closeChatSession,
    handleTyping,
    getUserChatSessions,
    getAllChatSessions,
    assignAgentToSession,
    searchFAQs,
    
    // Utilities
    canSendMessage: chatSession && chatSession.status === 'Open' && user,
    isAgent: user && [ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT].includes(user.role),
    currentUser: user
  };
}

/**
 * Customer-Client Chat Service
 * Separate chat system for customer-client communication
 * Uses customer_client_chat and customer_client_messages collections
 */

import pbclient from '@/lib/db';

class CustomerClientChatService {
  constructor() {
    this.pb = pbclient;
  }

  /**
   * Create a new chat session between customer and client
   * @param {string} customerId - Customer user ID
   * @param {string} clientId - Client user ID
   * @param {string} subject - Chat subject/topic
   * @param {string} serviceType - Type of service (CFS, Transport, 3PL, Warehouse)
   * @returns {Promise<Object>} Created chat session
   */
  async createChatSession(customerId, clientId, subject = '', serviceType = '') {
    try {
      // Check if a chat session already exists between these users
      const existingSessions = await this.pb.collection('customer_client_chat').getList(1, 1, {
        filter: `(customer = "${customerId}" && client = "${clientId}") || (customer = "${clientId}" && client = "${customerId}")`,
        sort: '-created'
      });

      if (existingSessions.items.length > 0) {
        console.log('Existing chat session found:', existingSessions.items[0]);
        return existingSessions.items[0];
      }

      // Create new chat session
      const sessionData = {
        customer: customerId,
        client: clientId,
        subject: subject || 'General Inquiry',
        serviceType: serviceType,
        status: 'Active',
        lastMessageAt: new Date().toISOString()
      };

      console.log('Creating new chat session:', sessionData);
      const session = await this.pb.collection('customer_client_chat').create(sessionData);
      console.log('Chat session created successfully:', session);
      
      return session;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Get chat sessions for a user
   * @param {string} userId - User ID (customer or client)
   * @param {string} userType - 'customer' or 'client'
   * @returns {Promise<Array>} List of chat sessions
   */
  async getChatSessions(userId, userType = 'customer') {
    try {
      const filter = userType === 'customer' 
        ? `customer = "${userId}"` 
        : `client = "${userId}"`;

      const sessions = await this.pb.collection('customer_client_chat').getList(1, 50, {
        filter: filter,
        sort: '-lastMessageAt',
        expand: 'customer,client'
      });

      console.log(`Retrieved ${sessions.items.length} chat sessions for ${userType}:`, userId);
      return sessions.items;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }

  /**
   * Get a specific chat session with messages
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - Current user ID for access control
   * @returns {Promise<Object>} Chat session with messages
   */
  async getChatSession(sessionId, userId) {
    try {
      // Get the chat session
      const session = await this.pb.collection('customer_client_chat').getOne(sessionId, {
        expand: 'customer,client'
      });

      console.log('Retrieved session:', session);

      // Check if user has permission to access this chat
      const canAccess = session.customer === userId || session.client === userId;
      console.log('Access check result:', { canAccess, sessionCustomer: session.customer, sessionClient: session.client, currentUserId: userId });

      if (!canAccess) {
        throw new Error('Access denied to this chat session');
      }

      // Get messages for this session
      const messages = await this.pb.collection('customer_client_messages').getList(1, 100, {
        filter: `chat = "${sessionId}"`,
        sort: 'created',
        expand: 'sender'
      });

      console.log('Retrieved messages:', messages.items.length);

      return {
        session,
        messages: messages.items
      };
    } catch (error) {
      console.error('Error fetching chat session:', error);
      throw error;
    }
  }

  /**
   * Send a message in a chat session
   * @param {string} sessionId - Chat session ID
   * @param {string} senderId - Sender user ID
   * @param {string} content - Message content
   * @param {File} attachment - Optional file attachment
   * @returns {Promise<Object>} Created message
   */
  async sendMessage(sessionId, senderId, content, attachment = null) {
    try {
      const messageData = {
        chat: sessionId,
        sender: senderId,
        content: content || '',
        messageType: 'text'
      };

      console.log('Preparing to send message:', { messageData, hasAttachment: !!attachment });

      // Handle file attachment if provided
      if (attachment) {
        const formData = new FormData();

        // Add message data to FormData
        Object.keys(messageData).forEach(key => {
          formData.append(key, messageData[key]);
        });

        // Handle both old format (direct File) and new format (object with file property)
        const file = attachment.file || attachment;

        console.log('File details:', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });

        formData.append('attachments', file);
        messageData.messageType = 'file';

        console.log('Sending message with attachment via FormData');
        const result = await this.pb.collection('customer_client_messages').create(formData);
        console.log('Message with attachment sent successfully:', result);
        
        // Update last message time
        await this.updateLastMessageTime(sessionId);
        
        return result;
      }

      // Send text message
      console.log('Sending text message');
      const result = await this.pb.collection('customer_client_messages').create(messageData);
      console.log('Text message sent successfully:', result);
      
      // Update last message time
      await this.updateLastMessageTime(sessionId);
      
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Update the last message timestamp for a chat session
   * @param {string} sessionId - Chat session ID
   */
  async updateLastMessageTime(sessionId) {
    try {
      await this.pb.collection('customer_client_chat').update(sessionId, {
        lastMessageAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating last message time:', error);
    }
  }

  /**
   * Mark messages as read
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - User ID marking messages as read
   */
  async markMessagesAsRead(sessionId, userId) {
    try {
      // Get unread messages for this user
      const unreadMessages = await this.pb.collection('customer_client_messages').getList(1, 100, {
        filter: `chat = "${sessionId}" && sender != "${userId}" && isRead = false`
      });

      // Mark each message as read
      for (const message of unreadMessages.items) {
        await this.pb.collection('customer_client_messages').update(message.id, {
          isRead: true,
          readAt: new Date().toISOString()
        });
      }

      console.log(`Marked ${unreadMessages.items.length} messages as read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  /**
   * Get unread message count for a user
   * @param {string} userId - User ID
   * @param {string} userType - 'customer' or 'client'
   * @returns {Promise<number>} Number of unread messages
   */
  async getUnreadMessageCount(userId, userType = 'customer') {
    try {
      // Get all chat sessions for this user
      const sessions = await this.getChatSessions(userId, userType);
      const sessionIds = sessions.map(session => session.id);

      if (sessionIds.length === 0) return 0;

      // Count unread messages across all sessions
      const filter = `chat.id ?~ "${sessionIds.join('|')}" && sender != "${userId}" && isRead = false`;
      
      const unreadMessages = await this.pb.collection('customer_client_messages').getList(1, 1, {
        filter: filter
      });

      return unreadMessages.totalItems;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
  }

  /**
   * Close a chat session
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - User ID closing the session
   */
  async closeChatSession(sessionId, userId) {
    try {
      await this.pb.collection('customer_client_chat').update(sessionId, {
        status: 'Closed',
        closedAt: new Date().toISOString(),
        closedBy: userId
      });

      console.log('Chat session closed:', sessionId);
    } catch (error) {
      console.error('Error closing chat session:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time chat updates
   * @param {string} sessionId - Chat session ID
   * @param {Function} onMessage - Callback for new messages
   * @param {Function} onSessionUpdate - Callback for session updates
   */
  subscribeToChat(sessionId, onMessage, onSessionUpdate) {
    try {
      // Subscribe to new messages
      this.pb.collection('customer_client_messages').subscribe('*', (e) => {
        if (e.record.chat === sessionId) {
          onMessage(e);
        }
      });

      // Subscribe to session updates
      this.pb.collection('customer_client_chat').subscribe(sessionId, (e) => {
        onSessionUpdate(e);
      });
    } catch (error) {
      console.error('Error subscribing to chat updates:', error);
    }
  }

  /**
   * Unsubscribe from chat updates
   */
  unsubscribeFromChat() {
    try {
      this.pb.collection('customer_client_messages').unsubscribe();
      this.pb.collection('customer_client_chat').unsubscribe();
    } catch (error) {
      console.error('Error unsubscribing from chat updates:', error);
    }
  }

  /**
   * Search messages in a chat session
   * @param {string} sessionId - Chat session ID
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching messages
   */
  async searchMessages(sessionId, searchTerm) {
    try {
      const messages = await this.pb.collection('customer_client_messages').getList(1, 50, {
        filter: `chat = "${sessionId}" && content ~ "${searchTerm}"`,
        sort: '-created',
        expand: 'sender'
      });

      return messages.items;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }
}

// Export singleton instance
const customerClientChatService = new CustomerClientChatService();
export default customerClientChatService;

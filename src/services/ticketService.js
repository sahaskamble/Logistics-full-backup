import pbclient from '@/lib/db';
import { ROLES } from '@/constants/roles';

/**
 * Ticket Service for PocketBase Integration
 * Handles ticket creation, management, and role-based access
 */
export class TicketService {
  constructor() {
    this.pb = pbclient;
  }

  /**
   * Create a new ticket
   * @param {string} customerId - Customer ID who created the ticket
   * @param {string} content - Ticket description/content
   * @returns {Promise<Object>} Created ticket
   */
  async createTicket(customerId, content) {
    try {
      // Check if user is authenticated
      if (!this.pb.authStore.isValid || !this.pb.authStore.record) {
        throw new Error('User must be authenticated to create ticket');
      }

      // Verify the user ID matches the authenticated user
      if (this.pb.authStore.record?.id !== customerId) {
        throw new Error('User ID mismatch - authentication required');
      }

      const ticketData = {
        customer: customerId,
        content: content,
        agent: null, // Will be assigned by GOL staff
        TicketName: null // Can only be set by GOL staff
      };

      console.log('Creating ticket with data:', ticketData);

      const ticket = await this.pb.collection('ticket').create(ticketData);
      
      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error(`Failed to create ticket: ${error.message}`);
    }
  }

  /**
   * Get user's tickets
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's tickets
   */
  async getUserTickets(userId) {
    try {
      if (!this.pb.authStore.isValid) {
        throw new Error('Authentication required');
      }

      // Get tickets where user is the creator
      const tickets = await this.pb.collection('ticket').getFullList({
        filter: `customer = "${userId}"`,
        sort: '-created',
        expand: 'customer,agent'
      });

      return tickets;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return [];
    }
  }

  /**
   * Get all tickets for agents
   * @returns {Promise<Array>} All tickets
   */
  async getAllTickets() {
    try {
      // Get all tickets for agents to manage
      const allTickets = await this.pb.collection('ticket').getFullList({
        sort: '-created',
        expand: 'customer,agent'
      });

      return allTickets;
    } catch (error) {
      console.error('Error getting all tickets:', error);
      return [];
    }
  }

  /**
   * Assign an agent to a ticket and set ticket name
   * @param {string} ticketId - Ticket ID
   * @param {string} agentId - Agent user ID
   * @param {string} ticketName - Name for the ticket (set by GOL staff)
   * @returns {Promise<Object>} Updated ticket
   */
  async assignAgentAndNameTicket(ticketId, agentId, ticketName) {
    try {
      const updatedTicket = await this.pb.collection('ticket').update(ticketId, {
        agent: agentId,
        TicketName: ticketName
      });

      return updatedTicket;
    } catch (error) {
      console.error('Error assigning agent and naming ticket:', error);
      throw error;
    }
  }

  /**
   * Update ticket name (only by GOL staff)
   * @param {string} ticketId - Ticket ID
   * @param {string} ticketName - New ticket name
   * @returns {Promise<Object>} Updated ticket
   */
  async updateTicketName(ticketId, ticketName) {
    try {
      const updatedTicket = await this.pb.collection('ticket').update(ticketId, {
        TicketName: ticketName
      });

      return updatedTicket;
    } catch (error) {
      console.error('Error updating ticket name:', error);
      throw error;
    }
  }

  /**
   * Get ticket by ID
   * @param {string} ticketId - Ticket ID
   * @returns {Promise<Object>} Ticket details
   */
  async getTicketById(ticketId) {
    try {
      const ticket = await this.pb.collection('ticket').getOne(ticketId, {
        expand: 'customer,agent'
      });

      return ticket;
    } catch (error) {
      console.error('Error getting ticket by ID:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const ticketService = new TicketService();
export default ticketService;

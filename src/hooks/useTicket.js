import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import { ROLES } from '@/constants/roles';
import { toast } from 'sonner';

/**
 * Custom hook for ticket management using useCollection
 * Provides ticket creation, fetching, and management functionality with real-time updates
 */
export function useTicket() {
  const { user } = useAuth();

  // Tickets with relation expansion (disable realtime for now to fix issues)
  const {
    data: tickets,
    loading,
    error,
    createItem: createTicketItem,
    updateItem: updateTicketItem,
    getItem: getTicketItem,
    mutation: refreshTickets
  } = useCollection('ticket', {
    expand: 'customer,assigned_to',
    sort: '-created'
  });

  // Get user's tickets
  const userTickets = useMemo(() => {
    if (!user || !tickets) return [];
    return tickets.filter(ticket => ticket.customer === user.id);
  }, [tickets, user]);

  // Check if user is an agent
  const isAgent = useMemo(() => {
    return user && [ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT].includes(user.role);
  }, [user]);

  // Check if user can manage tickets
  const canManageTickets = useMemo(() => {
    return user && [ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT].includes(user.role);
  }, [user]);

  /**
   * Create a new ticket
   */
  const createTicket = useCallback(async (content) => {
    if (!user) {
      toast.error('Please log in to create a ticket');
      return null;
    }

    if (!user.id) {
      toast.error('Invalid user session. Please log in again.');
      return null;
    }

    if (!content || !content.trim()) {
      toast.error('Please provide a description for your ticket');
      return null;
    }

    try {
      console.log('Creating ticket for user:', user);
      const ticketData = {
        customer: user.id,
        content: content.trim(),
        description: content.trim(), // Also set description field
        assigned_to: null,
        subject: null,
        status: 'Open',
        priority: 'Medium',
        accepted: false,
        rejected: false
      };

      const ticket = await createTicketItem(ticketData);
      toast.success('Ticket created successfully!');
      return ticket;
    } catch (err) {
      console.error('Ticket creation error:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      toast.error('Failed to create ticket: ' + errorMessage);
      return null;
    }
  }, [user, createTicketItem]);

  /**
   * Get user's tickets
   */
  const getUserTickets = useCallback(async () => {
    return userTickets;
  }, [userTickets]);

  /**
   * Get all tickets for agents
   */
  const getAllTickets = useCallback(async () => {
    if (!isAgent) return [];
    return tickets || [];
  }, [tickets, isAgent]);

  /**
   * Assign agent to ticket and set ticket name
   */
  const assignAgentAndNameTicket = useCallback(async (ticketId, agentId = null, ticketName) => {
    if (!user) return null;

    if (!ticketName || !ticketName.trim()) {
      toast.error('Please provide a name for the ticket');
      return null;
    }

    try {
      const actualAgentId = agentId || user.id;
      const updatedTicket = await updateTicketItem(ticketId, {
        agent: actualAgentId,
        TicketName: ticketName.trim()
      });
      toast.success('Ticket assigned and named successfully');
      return updatedTicket;
    } catch (err) {
      console.error('Error assigning agent and naming ticket:', err);
      toast.error('Failed to assign agent and name ticket');
      return null;
    }
  }, [user, updateTicketItem]);

  /**
   * Update ticket name (GOL staff only)
   */
  const updateTicketName = useCallback(async (ticketId, ticketName) => {
    if (!user) return null;

    if (!ticketName || !ticketName.trim()) {
      toast.error('Please provide a name for the ticket');
      return null;
    }

    try {
      const updatedTicket = await updateTicketItem(ticketId, {
        TicketName: ticketName.trim()
      });
      toast.success('Ticket name updated successfully');
      return updatedTicket;
    } catch (err) {
      console.error('Error updating ticket name:', err);
      toast.error('Failed to update ticket name');
      return null;
    }
  }, [user, updateTicketItem]);

  /**
   * Get ticket by ID
   */
  const getTicketById = useCallback(async (ticketId) => {
    if (!ticketId) return null;

    try {
      return await getTicketItem(ticketId, { expand: 'customer,agent' });
    } catch (err) {
      console.error('Error getting ticket by ID:', err);
      return null;
    }
  }, [getTicketItem]);

  /**
   * Update ticket (general purpose)
   */
  const updateTicket = useCallback(async (ticketId, updateData) => {
    if (!user || !canManageTickets) {
      toast.error('You do not have permission to update tickets');
      return null;
    }

    try {
      const updatedTicket = await updateTicketItem(ticketId, updateData);
      return updatedTicket;
    } catch (err) {
      console.error('Error updating ticket:', err);
      throw err; // Re-throw to allow caller to handle
    }
  }, [user, canManageTickets, updateTicketItem]);

  return {
    // State
    loading,
    error,
    isAgent,
    canManageTickets,

    // Data
    tickets,
    userTickets,

    // Actions
    createTicket,
    getUserTickets,
    getAllTickets,
    assignAgentAndNameTicket,
    updateTicketName,
    updateTicket,
    getTicketById,
    refreshTickets,

    // Clear error
    clearError: () => {}
  };
}

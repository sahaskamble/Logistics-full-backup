'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarProvider';
import { useTicket } from '@/hooks/useTicket';
import { toast } from 'sonner';
import {
  Ticket,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  Plus,
  Eye,
  MessageSquare,
  User,
  RefreshCw
} from 'lucide-react';

/**
 * Customer Tickets Page
 * Allows customers to view their tickets and create new ones
 */
export default function CustomerTicketsPage() {
  const { user } = useAuth();
  const { setTitle } = useSidebar();
  const { userTickets, loading, createTicket, refreshTickets } = useTicket();

  // Local state
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicketContent, setNewTicketContent] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setTitle('My Support Tickets');
  }, [setTitle]);

  // Filter tickets based on status and search
  const filteredTickets = userTickets?.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      ticket.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }) || [];

  // Handle create new ticket
  const handleCreateTicket = async () => {
    if (!newTicketContent.trim()) {
      toast.error('Please provide a description for your ticket');
      return;
    }

    setCreating(true);
    try {
      const ticket = await createTicket(newTicketContent);
      if (ticket) {
        setNewTicketContent('');
        setShowCreateForm(false);
        toast.success('Ticket created successfully!');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status, accepted, rejected) => {
    // If ticket is rejected or (closed and not accepted), show as rejected
    if (rejected || (status === 'Closed' && !accepted)) {
      return {
        icon: XCircle,
        text: 'Rejected',
        className: 'bg-red-100 text-red-800 border-red-200'
      };
    }

    if (!accepted) {
      return {
        icon: Clock,
        text: 'Pending Review',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    }

    switch (status) {
      case 'Open':
        return {
          icon: AlertCircle,
          text: 'Open',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'In_Progress':
        return {
          icon: Clock,
          text: 'In Progress',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case 'Resolved':
        return {
          icon: CheckCircle2,
          text: 'Resolved',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'Closed':
        return {
          icon: CheckCircle2,
          text: 'Closed',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Support Tickets</h1>
          <p className="text-foreground/70">Track and manage your support requests</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <div className="bg-accent rounded-lg border border-primary/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Create New Ticket</h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewTicketContent('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={newTicketContent}
              onChange={(e) => setNewTicketContent(e.target.value)}
              placeholder="Describe your issue in detail..."
              className="w-full p-3 border border-primary/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              rows={4}
            />
            
            <div className="flex space-x-2">
              <button
                onClick={handleCreateTicket}
                disabled={creating || !newTicketContent.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Ticket'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTicketContent('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-accent rounded-lg border border-primary/20 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-foreground/70" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tickets</option>
              <option value="Open">Open</option>
              <option value="In_Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 border border-primary/30 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshTickets}
            className="px-3 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-accent rounded-lg border border-primary/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading your tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-foreground/60">
            <Ticket className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {userTickets?.length === 0 ? 'No tickets yet' : 'No matching tickets'}
            </h3>
            <p className="text-foreground/70">
              {userTickets?.length === 0 
                ? 'Create your first support ticket to get help'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-primary/20">
            {filteredTickets.map((ticket) => {
              const statusBadge = getStatusBadge(ticket.status, ticket.accepted, ticket.rejected);
              const StatusIcon = statusBadge.icon;

              return (
                <div key={ticket.id} className="p-6 hover:bg-primary/5 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Ticket Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            <span className={
                              ticket.status === 'Resolved' ? 'line-through text-foreground/60' :
                              (ticket.rejected || (ticket.status === 'Closed' && !ticket.accepted)) ? 'line-through text-foreground/60' : ''
                            }>
                              {ticket.subject || `Ticket #${ticket.id.slice(-8)}`}
                            </span>
                            {ticket.status === 'Resolved' && (
                              <span className="ml-2 text-green-600 font-normal text-sm">(resolved)</span>
                            )}
                            {(ticket.rejected || (ticket.status === 'Closed' && !ticket.accepted)) && (
                              <span className="ml-2 text-red-600 font-normal text-sm">(rejected)</span>
                            )}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-foreground/70">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(ticket.created).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(ticket.updated).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusBadge.className}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {statusBadge.text}
                        </div>
                      </div>

                      {/* Ticket Content */}
                      <div className="mb-4">
                        <p className="text-foreground/80 line-clamp-3">
                          {ticket.content || ticket.description}
                        </p>
                      </div>

                      {/* Rejection Reason */}
                      {(ticket.rejected || (ticket.status === 'Closed' && !ticket.accepted)) && ticket.rejection_reason && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start">
                            <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-red-800 mb-1">Ticket Rejected</p>
                              <p className="text-sm text-red-700">{ticket.rejection_reason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Assigned Agent */}
                      {ticket.assigned_to && ticket.expand?.assigned_to && (
                        <div className="flex items-center text-sm text-foreground/70">
                          <User className="w-4 h-4 mr-1" />
                          Assigned to: {ticket.expand.assigned_to.firstname} {ticket.expand.assigned_to.lastname}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

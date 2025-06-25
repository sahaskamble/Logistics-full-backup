import React from 'react';
import { Clock, User, Package, Truck, Building, Warehouse, Circle, X } from 'lucide-react';

export default function ClientChatSessionList({ sessions, selectedSession, onSessionSelect, onCloseChat, currentUserId }) {
  
  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'CFS': return Package;
      case 'Transport': return Truck;
      case '3PL': return Building;
      case 'Warehouse': return Warehouse;
      default: return User;
    }
  };

  const getServiceColor = (serviceType) => {
    switch (serviceType) {
      case 'CFS': return 'text-blue-600 bg-blue-100';
      case 'Transport': return 'text-green-600 bg-green-100';
      case '3PL': return 'text-purple-600 bg-purple-100';
      case 'Warehouse': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getDisplayName = (session) => {
    const customer = session.expand?.customer;
    if (customer) {
      return `${customer.firstname || ''} ${customer.lastname || ''}`.trim() || customer.username || 'Unknown Customer';
    }
    return 'Unknown Customer';
  };

  const getLastMessage = (session) => {
    // In a real implementation, you would get the last message from the session
    // For now, we'll use the subject or a placeholder
    return session.subject || 'No messages yet';
  };

  const hasUnreadMessages = (session) => {
    // In a real implementation, you would check for unread messages
    // For now, we'll simulate based on status
    return session.status === 'Active' && Math.random() > 0.5;
  };

  const handleCloseChat = (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to close this chat?')) {
      onCloseChat(sessionId);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {sessions.map((session) => {
        const ServiceIcon = getServiceIcon(session.serviceType);
        const serviceColorClass = getServiceColor(session.serviceType);
        const isSelected = selectedSession?.id === session.id;
        const displayName = getDisplayName(session);
        const lastMessage = getLastMessage(session);
        const unread = hasUnreadMessages(session);

        return (
          <div
            key={session.id}
            onClick={() => onSessionSelect(session)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors relative ${
              isSelected ? 'bg-blue-50 border-r-2 border-blue-600' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar/Service Icon */}
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${serviceColorClass}`}>
                  <ServiceIcon size={20} />
                </div>
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-medium truncate ${
                    unread ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {displayName}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {unread && (
                      <Circle className="w-2 h-2 text-blue-600 fill-current" />
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(session.lastMessageAt || session.created)}
                    </span>
                  </div>
                </div>

                {/* Service Type Badge */}
                {session.serviceType && (
                  <div className="flex items-center mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${serviceColorClass}`}>
                      {session.serviceType}
                    </span>
                  </div>
                )}

                {/* Subject/Last Message */}
                <p className={`text-sm truncate ${
                  unread ? 'font-medium text-gray-900' : 'text-gray-600'
                }`}>
                  {session.subject || lastMessage}
                </p>

                {/* Status and Actions */}
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    session.status === 'Active' 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-gray-800 bg-gray-100'
                  }`}>
                    {session.status}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    {session.lastMessageAt && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {formatTime(session.lastMessageAt)}
                      </div>
                    )}
                    
                    {/* Close Chat Button */}
                    {session.status === 'Active' && (
                      <button
                        onClick={(e) => handleCloseChat(e, session.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                        title="Close chat"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-2 text-xs text-gray-500">
                  <span>Customer: {session.expand?.customer?.email || 'No email'}</span>
                </div>
              </div>
            </div>

            {/* Hover overlay for close button */}
            <div className="absolute inset-0 pointer-events-none group"></div>
          </div>
        );
      })}
    </div>
  );
}

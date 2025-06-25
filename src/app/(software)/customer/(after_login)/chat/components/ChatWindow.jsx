import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Download, User, Phone, Video, MoreVertical, Package, Truck, Building, Warehouse } from 'lucide-react';

export default function ChatWindow({ session, messages, currentUser, onSendMessage }) {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      case 'CFS': return 'text-blue-600';
      case 'Transport': return 'text-green-600';
      case '3PL': return 'text-purple-600';
      case 'Warehouse': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getOtherUser = () => {
    return session.expand?.client || { firstname: 'Unknown', lastname: 'User' };
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && attachments.length === 0) return;

    try {
      // Send message with first attachment (if any)
      await onSendMessage(messageText.trim(), attachments[0] || null);
      
      // Clear input
      setMessageText('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].url);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message) => {
    return message.sender === currentUser.id;
  };

  const otherUser = getOtherUser();
  const ServiceIcon = getServiceIcon(session.serviceType);
  const serviceColorClass = getServiceColor(session.serviceType);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            
            {/* User Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {`${otherUser.firstname || ''} ${otherUser.lastname || ''}`.trim() || otherUser.username || 'Unknown User'}
              </h2>
              <div className="flex items-center space-x-2">
                {session.serviceType && (
                  <div className="flex items-center space-x-1">
                    <ServiceIcon size={14} className={serviceColorClass} />
                    <span className="text-sm text-gray-600">{session.serviceType}</span>
                  </div>
                )}
                <span className="text-sm text-gray-500">•</span>
                <span className={`text-sm ${
                  session.status === 'Active' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {session.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Chat Subject */}
        {session.subject && (
          <div className="mt-2 text-sm text-gray-600">
            <strong>Subject:</strong> {session.subject}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMine = isMyMessage(message);
            const showAvatar = index === 0 || messages[index - 1].sender !== message.sender;

            return (
              <div
                key={message.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {showAvatar && !isMine && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                  {!showAvatar && !isMine && <div className="w-10" />}

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isMine
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {/* Message Content */}
                    {message.content && (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}

                    {/* File Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, attachIndex) => (
                          <div
                            key={attachIndex}
                            className={`flex items-center space-x-2 p-2 rounded ${
                              isMine ? 'bg-blue-500' : 'bg-gray-100'
                            }`}
                          >
                            <Paperclip size={14} />
                            <span className="text-xs flex-1 truncate">{attachment}</span>
                            <button className="text-xs hover:underline">
                              <Download size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Time */}
                    <div className={`text-xs mt-1 ${
                      isMine ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.created)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500">typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <Paperclip size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{attachment.name}</span>
                  <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                </div>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end space-x-2">
          {/* File Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Paperclip size={20} />
          </button>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() && attachments.length === 0}
            className={`p-2 rounded-lg transition-colors ${
              messageText.trim() || attachments.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  );
}

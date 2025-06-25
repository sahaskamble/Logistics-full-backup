'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { ROLES } from '@/constants/roles';
import { toast } from 'sonner';
import {
  Send,
  X,
  User,
  Bot,
  Clock,
  CheckCircle,
  FileText,
  Download,
  Image as ImageIcon,
  File as FileIcon,
  Eye,
  ExternalLink,
  Check,
  CheckCheck
} from 'lucide-react';
import EmojiPicker from '@/components/chat/EmojiPicker';
import FileUpload from '@/components/chat/FileUpload';

/**
 * Support Chat Component for Human Agents
 * Provides real-time chat interface for customer support
 */
export default function SupportChat({ sessionId, onClose }) {
  const { user } = useAuth();
  const {
    chatSession,
    messages,
    loading,
    error,
    isConnected,
    sendMessage,
    closeChatSession,
    loadChatSession,
    canSendMessage,
    currentUser
  } = useChat(sessionId);

  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat session on mount
  useEffect(() => {
    if (sessionId && user) {
      loadChatSession(sessionId);
    }
  }, [sessionId, user, loadChatSession]);





  const handleSendMessage = async () => {
    if (!input.trim() && !attachment) return;

    try {
      console.log('Sending message from component:', {
        content: input.trim(),
        attachment: attachment,
        attachmentType: attachment ? (attachment.file || attachment).type : null,
        attachmentName: attachment ? (attachment.file || attachment).name : null
      });

      await sendMessage(input.trim(), attachment);
      setInput('');
      setAttachment(null);
      toast.success(attachment ? 'File sent successfully!' : 'Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  const handleCloseChat = async () => {
    if (window.confirm('Are you sure you want to close this chat session?')) {
      try {
        await closeChatSession();
        toast.success('Chat session closed');
        if (onClose) onClose();
      } catch (error) {
        toast.error('Failed to close chat session');
      }
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setInput(prev => prev + emoji);
  };

  // Handle file removal
  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageSenderInfo = (message) => {
    const sender = message.expand?.sender || message.sender;
    if (typeof sender === 'string') {
      return { id: sender, username: 'User', role: 'Unknown' };
    }
    return {
      id: sender?.id || message.sender,
      username: sender?.username || 'User',
      role: sender?.role || 'Unknown'
    };
  };

  const isGOLStaffMessage = (senderInfo) => {
    return [ROLES.GOL_STAFF, ROLES.GOL_MOD, ROLES.ROOT].includes(senderInfo.role);
  };

  // Get file info from filename
  const getFileInfo = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return { type: 'image', icon: ImageIcon, color: 'text-green-600' };
    } else if (['pdf'].includes(extension)) {
      return { type: 'pdf', icon: FileText, color: 'text-red-600' };
    } else if (['doc', 'docx'].includes(extension)) {
      return { type: 'document', icon: FileText, color: 'text-blue-600' };
    } else if (['txt', 'rtf'].includes(extension)) {
      return { type: 'text', icon: FileText, color: 'text-gray-600' };
    } else {
      return { type: 'file', icon: FileIcon, color: 'text-gray-600' };
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Render attachment with WhatsApp-like styling
  const renderAttachment = (message) => {
    if (!message.attachments) return null;

    const attachmentUrl = message.attachments.startsWith('data:')
      ? message.attachments
      : `${process.env.NEXT_PUBLIC_PB_URL}/api/files/messages/${message.id}/${message.attachments}`;

    const filename = message.attachments.split('/').pop() || 'Unknown file';
    const fileInfo = getFileInfo(filename);
    const IconComponent = fileInfo.icon;

    console.log('Rendering attachment:', {
      messageId: message.id,
      attachments: message.attachments,
      filename,
      fileInfo,
      attachmentUrl
    });

    if (fileInfo.type === 'image') {
      return (
        <div className="relative group max-w-xs">
          <img
            src={attachmentUrl}
            alt="Shared image"
            className="rounded-lg max-w-full h-auto cursor-pointer transition-all duration-200 group-hover:brightness-90"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
            onClick={() => window.open(attachmentUrl, '_blank')}
          />
          {/* Image overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={() => window.open(attachmentUrl, '_blank')}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                title="View full size"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
              <a
                href={attachmentUrl}
                download={filename}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-gray-700" />
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      // Document/File attachment
      return (
        <div className="bg-background/80 border border-primary/20 rounded-lg p-3 max-w-xs hover:bg-background/90 transition-colors">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-background ${fileInfo.color}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {filename}
              </p>
              <p className="text-xs text-foreground/60">
                {fileInfo.type.toUpperCase()} Document
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </a>
            <a
              href={attachmentUrl}
              download={filename}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      );
    }
  };

  // Render file preview in input area
  const renderFilePreview = () => {
    if (!attachment) return null;

    const file = attachment.file || attachment;
    const filename = attachment.name || file.name;
    const fileInfo = getFileInfo(filename);
    const IconComponent = fileInfo.icon;

    if (fileInfo.type === 'image') {
      return (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-lg border border-primary/20"
            />
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
              <ImageIcon className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{filename}</p>
            <p className="text-xs text-foreground/60">
              {formatFileSize(file.size)} • Image
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-background ${fileInfo.color}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{filename}</p>
            <p className="text-xs text-foreground/60">
              {formatFileSize(file.size)} • {fileInfo.type.toUpperCase()}
            </p>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-foreground/70">Loading chat session...</p>
        </div>
      </div>
    );
  }

  console.log("Error", error);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <X className="w-8 h-8 mx-auto mb-2" />
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!chatSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-600">
          <User className="w-8 h-8 mx-auto mb-2" />
          <p>Chat session not found</p>
        </div>
      </div>
    );
  }

  const sessionUser = chatSession.expand?.user || chatSession.user;

  return (
    <div className="flex flex-col h-full bg-accent">
      {/* Header */}
      <div className="bg-primary text-accent p-4 flex justify-between items-center rounded-t-lg">
        <div>
          <h3 className="font-semibold">
            Support Chat - {sessionUser?.username || 'Customer'}
          </h3>
          <div className="text-sm opacity-90 flex items-center space-x-4">
            <span>Session: {chatSession.id}</span>
            <span className="flex items-center">
              {isConnected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Disconnected
                </>
              )}
            </span>
            <span>Status: {chatSession.status}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {chatSession.status === 'Open' && (
            <button
              onClick={handleCloseChat}
              className="px-3 py-1 bg-secondary text-accent rounded text-sm hover:bg-secondary/90"
            >
              Close Chat
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent/20 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background rounded-lg">
        {messages.map((message, index) => {
          const senderInfo = getMessageSenderInfo(message);
          const isCurrentUser = senderInfo.id === currentUser?.id;
          const isGOLStaff = isGOLStaffMessage(senderInfo);
          const isBot = senderInfo.role === 'bot' || message.sender === 'bot';

          return (
            <div
              key={message.id || index}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                  isCurrentUser
                    ? 'bg-primary text-accent rounded-br-md'
                    : isGOLStaff
                    ? 'bg-green-100 border border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200 rounded-bl-md'
                    : isBot
                    ? 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200 rounded-bl-md'
                    : 'bg-accent text-foreground border border-primary/20 rounded-bl-md'
                }`}
              >
                {/* Sender info - Compact WhatsApp style */}
                {!isCurrentUser && (
                  <div className="flex items-center space-x-2 mb-1">
                    {isBot ? (
                      <Bot className="w-3 h-3" />
                    ) : isGOLStaff ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {isBot
                        ? 'Support Bot'
                        : isGOLStaff
                        ? `${senderInfo.username}`
                        : senderInfo.username}
                    </span>
                    {isGOLStaff && (
                      <span className="text-xs text-green-600 font-medium">GOL</span>
                    )}
                  </div>
                )}

                {/* Message content */}
                <div className="whitespace-pre-wrap break-words">
                  {message.content || message.text}
                </div>

                {/* Message timestamp and status - WhatsApp style */}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs opacity-60">
                    {formatMessageTime(message.created || message.timestamp)}
                  </span>
                  {isCurrentUser && (
                    <div className="flex">
                      <CheckCheck className="w-4 h-4 text-blue-400" title="Delivered" />
                    </div>
                  )}
                </div>

                {/* Attachment - WhatsApp Style */}
                {message.attachments && (
                  <div className="mt-3">
                    {renderAttachment(message)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - WhatsApp Style */}
      {canSendMessage && chatSession.status === 'Open' && (
        <div className="border-t border-primary/20 bg-accent">
          {/* File Upload Preview */}
          {attachment && (
            <div className="p-4 pb-2">
              <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">File to send:</span>
                  <button
                    onClick={handleRemoveAttachment}
                    className="p-1 text-foreground/60 hover:text-foreground hover:bg-background/50 rounded transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {renderFilePreview()}
              </div>
            </div>
          )}

          {/* Input Row */}
          <div className="p-4 rounded-b-lg">
            <div className="flex justify-center items-center gap-2">
              {/* File Upload Button */}
              <FileUpload
                onFileSelect={setAttachment}
                attachment={null} // Don't show preview here, we handle it above
                onRemoveAttachment={handleRemoveAttachment}
                className=""
              />

              {/* Emoji Picker */}
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />

              {/* Message Input */}
              <div className="flex-1 flex justify-center items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={attachment ? "Add a caption..." : "Type your message... 😊"}
                  className="w-full p-3 border border-primary/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-all"
                  rows={1}
                  style={{
                    minHeight: '44px',
                    maxHeight: '120px',
                    scrollbarWidth: 'thin'
                  }}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() && !attachment}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  input.trim() || attachment
                    ? 'bg-primary text-accent hover:bg-primary/90 scale-100'
                    : 'bg-primary/50 text-accent/50 cursor-not-allowed scale-95'
                }`}
                title={attachment ? "Send file" : "Send message"}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {chatSession.status === 'Close' && (
        <div className="border-t border-primary/20 p-4 bg-background text-center text-foreground/70">
          This chat session has been closed.
        </div>
      )}
    </div>
  );
}

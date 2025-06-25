'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

/**
 * Simple Emoji Picker Component
 * Provides common emojis for chat messages
 */
export default function EmojiPicker({ onEmojiSelect, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  // Common emojis organized by category
  const emojiCategories = {
    'Smileys': [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
      '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
      '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩'
    ],
    'Emotions': [
      '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
      '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
      '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗'
    ],
    'Gestures': [
      '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
      '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋',
      '🖖', '👏', '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿'
    ],
    'Objects': [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐'
    ]
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Emoji Button - WhatsApp Style */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground/60 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-full transition-all duration-200 hover:scale-110"
        title="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </button>

      {/* Emoji Picker Popup */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-accent border border-primary/20 rounded-lg shadow-lg p-4 w-80 max-h-64 overflow-y-auto z-50">
          <div className="space-y-3">
            {Object.entries(emojiCategories).map(([category, emojis]) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-foreground/70 mb-2">{category}</h4>
                <div className="grid grid-cols-10 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={`${category}-${index}`}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className="w-6 h-6 flex items-center justify-center text-lg hover:bg-background/50 rounded transition-colors"
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

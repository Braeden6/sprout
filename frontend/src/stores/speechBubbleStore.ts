import { create } from 'zustand';

export interface SpeechMessage {
  text: string;
  audioUrl?: string; // Path to .wav file
}

export interface SpeechBubbleData {
  id: string;
  messages: SpeechMessage[]; // Support multiple messages
  currentMessageIndex: number;
  position: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    transform?: string;
  };
  characterImage?: string; // Path to character image
  characterPosition?: 'left' | 'right' | 'top' | 'bottom'; // Where character appears relative to bubble
  size?: 'small' | 'medium' | 'large' | number;
  variant?: 'default' | 'muted' | 'accent';
  duration?: number; // Duration in ms, 0 for permanent
  maxWidth?: number;
  zIndex?: number;
  isVisible?: boolean;
  showNavigation?: boolean; // Show forward/back buttons when multiple messages
  autoPlay?: boolean; // Auto-play audio when message changes
}

interface SpeechBubbleStore {
  bubbles: SpeechBubbleData[];
  defaultDuration: number;
  isGloballyVisible: boolean;
  
  // Actions
  addBubble: (bubble: Omit<SpeechBubbleData, 'id' | 'isVisible' | 'currentMessageIndex'>) => string;
  removeBubble: (id: string) => void;
  updateBubble: (id: string, updates: Partial<SpeechBubbleData>) => void;
  clearAllBubbles: () => void;
  showBubble: (id: string) => void;
  hideBubble: (id: string) => void;
  toggleGlobalVisibility: () => void;
  setGlobalVisibility: (visible: boolean) => void;
  
  // Message navigation
  nextMessage: (id: string) => void;
  previousMessage: (id: string) => void;
  setCurrentMessage: (id: string, index: number) => void;
  
  // Utility actions
  addTemporaryBubble: (
    messages: SpeechMessage[] | string, 
    position: SpeechBubbleData['position'], 
    options?: Partial<Omit<SpeechBubbleData, 'id' | 'messages' | 'position' | 'isVisible' | 'currentMessageIndex'>>
  ) => string;
  
  addCharacterBubble: (
    messages: SpeechMessage[] | string,
    characterImage: string,
    position: SpeechBubbleData['position'],
    options?: Partial<Omit<SpeechBubbleData, 'id' | 'messages' | 'characterImage' | 'position' | 'isVisible' | 'currentMessageIndex'>>
  ) => string;
}

export const useSpeechBubbleStore = create<SpeechBubbleStore>((set, get) => ({
  bubbles: [],
  defaultDuration: 3000, // 3 seconds
  isGloballyVisible: true,

  addBubble: (bubble) => {
    const id = `bubble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newBubble: SpeechBubbleData = {
      ...bubble,
      id,
      currentMessageIndex: 0,
      isVisible: true,
      showNavigation: bubble.messages.length > 1,
    };

    set((state) => ({
      bubbles: [...state.bubbles, newBubble],
    }));

    // Auto-remove if duration is set
    if (bubble.duration && bubble.duration > 0) {
      setTimeout(() => {
        get().removeBubble(id);
      }, bubble.duration);
    }

    return id;
  },

  removeBubble: (id) => {
    set((state) => ({
      bubbles: state.bubbles.filter((bubble) => bubble.id !== id),
    }));
  },

  updateBubble: (id, updates) => {
    set((state) => ({
      bubbles: state.bubbles.map((bubble) =>
        bubble.id === id ? { ...bubble, ...updates } : bubble
      ),
    }));
  },

  clearAllBubbles: () => {
    set({ bubbles: [] });
  },

  showBubble: (id) => {
    get().updateBubble(id, { isVisible: true });
  },

  hideBubble: (id) => {
    get().updateBubble(id, { isVisible: false });
  },

  toggleGlobalVisibility: () => {
    set((state) => ({ isGloballyVisible: !state.isGloballyVisible }));
  },

  setGlobalVisibility: (visible) => {
    set({ isGloballyVisible: visible });
  },

  nextMessage: (id) => {
    const bubble = get().bubbles.find(b => b.id === id);
    if (bubble && bubble.currentMessageIndex < bubble.messages.length - 1) {
      get().updateBubble(id, { 
        currentMessageIndex: bubble.currentMessageIndex + 1 
      });
    }
  },

  previousMessage: (id) => {
    const bubble = get().bubbles.find(b => b.id === id);
    if (bubble && bubble.currentMessageIndex > 0) {
      get().updateBubble(id, { 
        currentMessageIndex: bubble.currentMessageIndex - 1 
      });
    }
  },

  setCurrentMessage: (id, index) => {
    const bubble = get().bubbles.find(b => b.id === id);
    if (bubble && index >= 0 && index < bubble.messages.length) {
      get().updateBubble(id, { currentMessageIndex: index });
    }
  },

  addTemporaryBubble: (messages, position, options = {}) => {
    const duration = options.duration ?? get().defaultDuration;
    const messageArray = typeof messages === 'string' 
      ? [{ text: messages }] 
      : messages;
    
    return get().addBubble({
      messages: messageArray,
      position,
      duration,
      ...options,
    });
  },

  addCharacterBubble: (messages, characterImage, position, options = {}) => {
    const messageArray = typeof messages === 'string' 
      ? [{ text: messages }] 
      : messages;
    
    return get().addBubble({
      messages: messageArray,
      characterImage,
      position,
      characterPosition: 'left',
      showNavigation: messageArray.length > 1,
      ...options,
    });
  },
})); 
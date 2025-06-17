import { create } from 'zustand';

export interface SpeechMessage {
  text: string;
  audioUrl?: string;
}

interface SpeechBubbleStore {
  messages: SpeechMessage[];
  currentMessageIndex: number;
  
  isNextMessageAvailable: () => boolean;
  isPreviousMessageAvailable: () => boolean;

  addMessage: (message: SpeechMessage) => void;
  clearMessages: () => void;
  setInitialMessage: (message: SpeechMessage) => void;

  nextMessage: () => void ;
  previousMessage: () => void;
  goToLastMessage: () => void;
}

export const useSpeechBubbleStore = create<SpeechBubbleStore>((set, get) => ({
  messages: [],
  currentMessageIndex: 0,
  isNextMessageAvailable: () => {
    return get().currentMessageIndex < get().messages.length - 1;
  },
  isPreviousMessageAvailable: () => {
    return get().currentMessageIndex > 0;
  },
  


  addMessage: (message: SpeechMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => {  
    set({
      messages: [],
      currentMessageIndex: 0,
    });
  },



  setInitialMessage: (message: SpeechMessage) => {
    if (get().messages.length === 0) {
      set(() => ({
        messages: [message],
        currentMessageIndex: 0,
      }));
    }
  },

  nextMessage: () => {
    set((state) => ({
      currentMessageIndex: state.currentMessageIndex + 1,
    }));
  },
  previousMessage: () => {  
    set((state) => ({
      currentMessageIndex: state.currentMessageIndex - 1,
    }));
  },
  goToLastMessage: () => {
    set((state) => ({
      currentMessageIndex: state.messages.length - 1,
    }));
  },


})); 
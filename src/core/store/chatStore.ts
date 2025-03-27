import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService } from '../api/chatService';

type Page = 'chat' | 'tools' | 'queries' | 'workflows';
type MessageRole = 'user' | 'assistant';

interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  saved: boolean;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  activePage: Page;
  theme: 'light' | 'dark';
  isCollapsed: boolean;
  isLoading: boolean;
  error: string | null;
  addConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  setActivePage: (page: Page) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (message: string) => Promise<void>;
  saveConversation: (conversationId: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create(
  persist<ChatState>(
    (set, get) => ({
  conversations: [],
  activeConversationId: null,
  activePage: 'chat',
  theme: 'dark',
  isCollapsed: false,
  isLoading: false,
  error: null,
  
  addConversation: (id) => set((state) => {
    const newConversation: Conversation = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      saved: false
    };
    
    return {
      conversations: [...state.conversations, newConversation],
      activeConversationId: id,
      activePage: 'chat'
    };
  }),

  setActiveConversation: (id) => set({ activeConversationId: id, activePage: 'chat' }),

  setActivePage: (page) => set({ activePage: page }),

  addMessage: (conversationId, message) => set((state) => {
    const conversations = state.conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, {
            ...message,
            id: crypto.randomUUID(),
            timestamp: new Date(),
          }],
          updatedAt: new Date(),
        };
      }
      return conv;
    });
    return { conversations };
  }),

  sendMessage: async (message) => {
    const state = get();
    if (!state.activeConversationId) {
      set({ error: 'No active conversation' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      
      // Add user message optimistically
      get().addMessage(state.activeConversationId, {
        content: message,
        role: 'user',
      });

      // Send to backend
      const response = await chatService.sendMessage(message, state.activeConversationId);
      
      // Add assistant response
      get().addMessage(state.activeConversationId, {
        content: response.response,
        role: 'assistant',
      });
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        // Session expired, create new one
        set({ isLoading: true });
        const session = await chatService.createNewSession();
        get().addConversation(session.id);
        get().setActiveConversation(session.id);
        
        // Retry with new session
        const response = await chatService.sendMessage(message, session.id);
        get().addMessage(session.id, {
          content: response.response,
          role: 'assistant',
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        set({ error: errorMessage });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  saveConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, saved: true } : conv
    )
  })),

  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),

  toggleSidebar: () => set((state) => ({
    isCollapsed: !state.isCollapsed,
  })),

  setError: (error) => set({ error }),
}),
    {
      name: 'chat-store',
      partialize: (state) => ({ ...state })
    }
  )
);

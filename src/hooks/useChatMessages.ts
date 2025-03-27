import { useRef, useEffect } from 'react';
import { useChatStore } from '../core/store/chatStore';
import { chatService } from '../core/api/chatService';
import { toast } from 'sonner';
import type { ChatSession } from '../core/types';

export function useChatMessages() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    conversations, 
    activeConversationId, 
    addMessage, 
    addConversation,
    setActiveConversation
  } = useChatStore();

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!activeConversationId) {
      // Create new session if none exists
      try {
        const session = await chatService.createNewSession();
        addConversation(session.id);
        setActiveConversation(session.id);
        await sendMessageToConversation(message, session.id);
      } catch (error) {
        toast.error('Failed to create new conversation');
      }
      return;
    }

    await sendMessageToConversation(message, activeConversationId);
  };

  const sendMessageToConversation = async (message: string, conversationId: string) => {
    try {
      // Add user message optimistically
      addMessage(conversationId, {
        content: message,
        role: 'user',
      });

      // Send to backend
      const response = await chatService.sendMessage(message, conversationId);
      
      // Add assistant response
      addMessage(conversationId, {
        content: response.response,
        role: 'assistant',
      });
    } catch (error: any) {
      if (error?.status === 404) {
        // Session expired, create new one
        const session = await chatService.createNewSession();
        addConversation(session.id);
        setActiveConversation(session.id);
        await sendMessageToConversation(message, session.id);
      } else {
        toast.error('Failed to send message');
        console.error('Failed to send message:', error);
      }
    }
  };

  const createNewSession = async (): Promise<ChatSession | undefined> => {
    // If there are stored conversations, set the first one as active
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversation(conversations[0].id);
      return;
    }

    try {
      const session = await chatService.createNewSession();
      addConversation(session.id);
      setActiveConversation(session.id);
      return session;
    } catch (error) {
      console.error('Failed to create new session:', error);
      toast.error('Failed to create new conversation');
      return undefined;
    }
  };

  return {
    activeConversation,
    messagesEndRef,
    sendMessage,
    createNewSession,
  };
}

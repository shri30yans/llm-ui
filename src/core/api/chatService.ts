import { chatApi } from './chatApi';
import type { ChatResponse, ChatSession } from '../types';
import { toast } from 'sonner';

class ChatService {
  async createNewSession(): Promise<ChatSession> {
    try {
      return await chatApi.createConversation();
    } catch (error) {
      console.error('ChatService: Failed to create new session:', error);
      toast.error('Failed to create new conversation');
      throw error;
    }
  }

  async sendMessage(message: string, conversationId: string): Promise<ChatResponse> {
    if (!message.trim() || !conversationId) {
      toast.error('Invalid message or conversation');
      throw new Error('Invalid message or conversation');
    }

    try {
      return await chatApi.sendMessage(conversationId, message);
    } catch (error) {
      console.error('ChatService: Failed to send message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await chatApi.deleteConversation(conversationId);
    } catch (error) {
      console.error('ChatService: Failed to delete conversation:', error);
      toast.error('Failed to delete conversation');
      throw error;
    }
  }

  async deleteConversations(conversationIds: string[]): Promise<void> {
    try {
      await Promise.all(
        conversationIds.map(id => this.deleteConversation(id))
      );
    } catch (error) {
      console.error('ChatService: Failed to delete conversations:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();

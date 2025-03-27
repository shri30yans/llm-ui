import { apiClient } from './client';
import type { ChatResponse, ChatSession } from '../types';

export const chatApi = {
  async createConversation(): Promise<ChatSession> {
    return apiClient.post<ChatSession>('/chat/create');
  },
  
  async sendMessage(conversationId: string, message: string): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/chat/send', {
      conversation_id: conversationId,
      message,
      timestamp: new Date().toISOString()
    });
  },
  
  async deleteConversation(conversationId: string): Promise<void> {
    return apiClient.post('/chat/delete', {
      conversation_id: conversationId
    });
  }
};
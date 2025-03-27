export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  saved: boolean;
}



export interface ChatMessage {
  message: string;
  conversation_id?: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  created_at: string;
  updated_at?: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

export interface DatabaseQuery {
  type: "database_query";
  query: string;
  time: number;
  next: string[];
}

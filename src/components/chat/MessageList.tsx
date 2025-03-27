import { Message } from '../../core/types';
import { Bot } from 'lucide-react';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

export function MessageList({ messages, messagesEndRef, isLoading }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div 
          key={message.id} 
          className={`flex items-start gap-3 message-animation ${
           message.role === 'assistant' ? 'assistant-message' : 'user-message flex-row-reverse justify-end'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`flex-1 flex ${message.role === 'assistant' ? '' : 'justify-end'} max-w-full overflow-hidden`}>
            {message.role === 'assistant' ? (
              <AssistantMessage message={message} />
            ) : (
              <UserMessage message={message} />
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef}>
        {isLoading && (
          <div className="flex items-center gap-2 py-4 pl-4 animate-pulse thinking-container">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-primary text-sm font-medium">Thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}

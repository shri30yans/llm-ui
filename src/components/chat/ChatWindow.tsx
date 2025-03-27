import { useEffect, useRef } from 'react';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useChatStore } from '../../core/store/chatStore';
import clsx from 'clsx';
import { ChatSuggestions } from './ChatSuggestions';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { ScrollToBottom } from './ScrollToBottom';

export function ChatWindow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    activeConversation,
    messagesEndRef,
    createNewSession
  } = useChatMessages();

  const { conversations, isLoading, isCollapsed } = useChatStore();

  useEffect(() => {
    const initializeChat = async () => {
      if (!activeConversation && conversations.length === 0) {
        try {
          await createNewSession();
        } catch (error) {
          console.error('Failed to initialize chat:', error);
        }
      }
    };
    
    initializeChat();
  }, [conversations.length, activeConversation]);

  // Show loading state if initializing
  if (!activeConversation && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Initializing chat...</div>
      </div>
    );
  }

  if (!activeConversation) {
    return null;
  }

  const showSuggestions = activeConversation?.messages.length === 0;

  return (
    <div className="grid grid-rows-[1fr_auto] h-full max-w-full bg-[var(--chat-bg)] overflow-hidden">
      <div ref={containerRef} className="w-full overflow-y-auto relative">
        <div className={clsx(
          "mx-auto p-4 space-y-4 w-full transition-all duration-300 ease-in-out",
          isCollapsed ? "max-w-5xl" : "max-w-3xl"
        )}>
          {showSuggestions && <ChatSuggestions />}
          <div className="relative">
            <MessageList
              messages={activeConversation.messages}
              messagesEndRef={messagesEndRef}
              isLoading={isLoading}
            />
            <div className="absolute bottom-4 w-full flex justify-center">
              <ScrollToBottom containerRef={containerRef} messagesEndRef={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
      <div className={clsx(
        "flex flex-col w-full mx-auto bg-gradient-to-t from-[var(--chat-bg)] to-[var(--chat-bg)]/95 pb-4 transition-all duration-300 ease-in-out",
        isCollapsed ? "max-w-5xl" : "max-w-3xl"
      )}>
        <ChatInput />
      </div>
    </div>
  );
}

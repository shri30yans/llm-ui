import {
  MessageSquare,
  Send,
  Code2,
  Brush,
  Bot
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useChatStore } from '../../core/store/chatStore';

const suggestions = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Ask anything",
    description: "Software development, programming, or technology",
    prompt: "I'd like to ask about AGILE"
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "Generate code",
    description: "Write code, create functions, or complete implementations",
    prompt: "Please help me write code for my Python Script"
  },
  {
    icon: <Send className="h-5 w-5" />,
    title: "Use tools",
    description: "I can help you with tasks like code generation, debugging, and more",
    prompt: "Help me debug this"
  },
  {
    icon: <Brush className="h-5 w-5" />,
    title: "Improve UI/UX",
    description: "Let me help you enhance your application's user interface and experience",
    prompt: "Help me improve the design of my website"
  }
];

export function ChatSuggestions() {
  const { sendMessage } = useChatStore();
  return (
    <div className="h-full text-center space-y-8">
      <div className="flex flex-col items-center py-8 space-y-4">
        <Bot className="w-24 h-24 text-primary animate-pulse" />
        <h2 className="text-4xl font-semibold text-primary">How can I help you today?</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 suggestions-animation">
        {suggestions.map((suggestion, index) => (
            <Card
            key={index}
            className="p-8 hover:bg-[var(--hover-background)] cursor-pointer transition-colors border-text-muted"
            onClick={() => sendMessage(suggestion.prompt)}
            >
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-primary/10">
              {suggestion.icon}
              </div>
              <div className="flex-1">
              <h3 className="font-medium mb-1 text-[var(--message-text)] text-lg">
                {suggestion.title}
              </h3>
              <p className="text-[var(--message-text)] text-md">
                {suggestion.description}
              </p>
              </div>
            </div>
            </Card>
        ))}
      </div>
    </div>
  );
}

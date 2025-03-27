import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../../core/store/chatStore';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading, error } = useChatStore();

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);
  };

  return (
    <div>
      {/* {error && (
        <div className="text-red-500 text-sm text-center mb-2">
          {error}
        </div>
      )} */}
      <form onSubmit={handleSubmit} className="p-4 w-full max-w-3xl mx-auto">
        <div className="relative w-full rounded-3xl bg-[var(--input-bg)] pr-14 text-[var(--input-text)]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
            rows={2}
            placeholder={isLoading ? "Sending message..." : "Type your message..."}
            className="w-full rounded-3xl bg-[var(--input-bg)] p-6 placeholder-[var(--input-placeholder)] resize-none overflow-y-auto disabled:opacity-50"
            style={{ minHeight: '80px', maxHeight: '200px' }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="absolute bottom-4 right-4 rounded-full p-2 disabled:opacity-50"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </div>
  );
}
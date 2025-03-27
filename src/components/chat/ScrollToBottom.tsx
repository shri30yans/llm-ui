import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useChatStore } from '../../core/store/chatStore';
import clsx from 'clsx';

interface ScrollToBottomProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ScrollToBottom({ containerRef, messagesEndRef }: ScrollToBottomProps) {
  const [showButton, setShowButton] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { isCollapsed } = useChatStore();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 100;
      if (isNotAtBottom && !showButton) {
        setIsLeaving(false);
        setShowButton(true);
      } else if (!isNotAtBottom && showButton) {
        setIsLeaving(true);
        setTimeout(() => {
          setShowButton(false);
          setIsLeaving(false);
        }, 200); // Match animation duration
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!showButton) return null;
  
  return (
    <button
        onClick={scrollToBottom}
        className={clsx(
          "bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-all duration-200",
          isLeaving ? "animate-fade-out" : "animate-fade-in"
        )}
      >
      <ChevronDown className="h-5 w-5" />
      </button>
  );
}

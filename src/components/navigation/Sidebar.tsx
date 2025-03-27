import { useCallback } from "react";
import { useChatStore } from "@/core/store/chatStore";
import { toast } from "sonner";
import { chatService } from "@/core/api/chatService";
import {
  MessageSquarePlus,
  MessageSquare,
  Menu,
  PenTool as Tool,
  Search,
  GitGraph,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SIDEBAR_ITEMS = [
  { id: "tools", icon: Tool, label: "Tools" },
  { id: "queries", icon: Search, label: "Queries" },
  { id: "workflows", icon: GitGraph, label: "Workflows" },
] as const;

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    addConversation,
    setActiveConversation,
    setActivePage,
    isCollapsed,
  } = useChatStore();

  const handleNewChat = useCallback(async () => {
    try {
      const session = await chatService.createNewSession();
      addConversation(session.id);
      setActiveConversation(session.id);
    } catch (error) {
      console.error('Failed to create new chat:', error);
      toast.error('Failed to create new conversation');
    }
  }, [addConversation, setActiveConversation]);

  return (
    <div className="relative h-full">
      <div className={`absolute inset-0 bg-background space-y-7 p-4 flex flex-col border-r transition-[transform,opacity,width] duration-300 ease-in-out overflow-hidden ${
        isCollapsed ? "w-0 -translate-x-full opacity-0 invisible" : "w-72 translate-x-0 opacity-100 visible"}`}>
      <div className="flex-1 space-y-2">
      <div className="flex justify-between mb-6">
        <Button
        variant="ghost"
        className="justify-end text-muted-foreground hover:text-foreground hover:bg-secondary"
        onClick={() => useChatStore.setState({ isCollapsed: true })}
        >
        <Menu className="h-8 w-8" />
        </Button>
        <Button
        variant="ghost"
        className="justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
        onClick={handleNewChat}
        >
        <MessageSquarePlus className="h-8 w-8 mr-2" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 h-[calc(100vh-20rem)] m-1">
        {conversations.map((conv: { id: string; title?: string }) => (
        <Button
          key={conv.id}
          variant={activeConversationId === conv.id ? "secondary" : "ghost"}
          className="w-full justify-start p-6 text-muted-foreground"
          onClick={() => setActiveConversation(conv.id)}
        >
          <MessageSquare className="h-7 w-7 mr-2" />
          <span className="truncate text-md">{conv.title || "New Chat"}</span>
        </Button>
        ))}

      </div>
      </div>

      <div className="space-y-2">
      {SIDEBAR_ITEMS.map((item) => (
        <Button
        key={item.id}
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary text-lg p-6"
        onClick={() => setActivePage(item.id)}
        >
        <item.icon className="h-5 w-5 mr-2" />
        {item.label}
        </Button>
      ))}
      </div>
      <Button
      variant="ghost"
      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-[var(--hover-background)] text-lg"
      onClick={async () => {
        const { conversations } = useChatStore.getState();
        if (conversations.length === 0) return;
        
        try {
          // Delete from backend first
          // Delete from backend first
          await Promise.all(
            conversations.map(conv => 
              chatService.deleteConversation(conv.id).catch(() => {
                // Ignore individual deletion errors
                console.warn(`Failed to delete conversation: ${conv.id}`);
              })
            )
          );
          
          // Then clear from store
          useChatStore.setState({
            conversations: [],
            activeConversationId: null,
          });
          
          toast.success('Conversations cleared');
        } catch (error) {
          console.error('Failed to clear conversations:', error);
          toast.error('Failed to clear some conversations');
        }
      }}
      >
      <Trash2 className="h-7 w-7 mr-2 text-red-500" />
      Clear Chat
      </Button>
      </div>
    </div>
  );
}

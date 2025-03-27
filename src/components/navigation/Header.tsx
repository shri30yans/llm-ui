import { MessageSquarePlus, Menu, Moon, Sun, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/core/store/chatStore";

interface HeaderProps {
  toggleSidebar: () => void;
  handleNewChat: () => void;
}

export function Header({ toggleSidebar, handleNewChat }: HeaderProps) {
  const { theme, toggleTheme, isCollapsed } = useChatStore();

  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-4">
        {isCollapsed && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground hover:bg-[var(--hover-background)]"
            >
              <Menu className="h-7 w-7" />
            </Button>

            <Button
              variant="ghost"
              className="justify-start text-muted-foreground hover:text-foreground hover:bg-[var(--hover-background)]"
              onClick={handleNewChat}
            >
              <MessageSquarePlus className="h-7 w-7" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Bot className="w-9 h-9 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Bot</h1>
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={toggleTheme}
        className="text-muted-foreground hover:text-foreground hover:bg-[var(--hover-background)]"
      >
        {theme === "light" ? (
          <>
            <Moon className="h-4 w-4 mr-2" />
            Dark Mode
          </>
        ) : (
          <>
            <Sun className="h-4 w-4 mr-2" />
            Light Mode
          </>
        )}
      </Button>
    </div>
  );
}
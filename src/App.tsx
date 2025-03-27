import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Sidebar } from './components/navigation/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { ToolsPage } from './pages/ToolsPage';
import { QueriesPage } from './pages/QueriesPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { useChatStore } from './core/store/chatStore';
import { Header } from './components/navigation/Header';
import { chatService } from './core/api/chatService';

function App() {
  const { theme, activePage, toggleSidebar, isCollapsed } = useChatStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleNewChat = async () => {
    try {
      const session = await chatService.createNewSession();
      useChatStore.getState().addConversation(session.id);
      useChatStore.getState().setActiveConversation(session.id);
    } catch (error) {
      console.error('Failed to create new chat:', error);
      toast.error('Failed to create new conversation');
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'tools':
        return <ToolsPage />;
      case 'queries':
        return <QueriesPage />;
      case 'workflows':
        return <WorkflowsPage />;
      default:
        return <ChatWindow />;
    }
  };

  return (
    <div className="flex h-screen">
      <Toaster richColors position="bottom-right" />
      <Sidebar />
      <main className={`flex flex-col flex-1 bg-[var(--message-background)] transition-all duration-300 ease-in-out ${
        isCollapsed ? "ml-0 w-full" : "ml-72"}`}>
        <Header toggleSidebar={toggleSidebar} handleNewChat={handleNewChat} />
        {renderActivePage()}
      </main>
    </div>
  );
}

export default App;

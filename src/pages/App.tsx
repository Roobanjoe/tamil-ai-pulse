import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle initial query from landing page
  useEffect(() => {
    if (location.state?.initialQuery) {
      // Handle the initial query here when chat interface is ready
      console.log('Initial query:', location.state.initialQuery);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(undefined);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleChatCreated = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  return (
    <div className="h-screen bg-background flex relative">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-50 hover-glow"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'absolute' : 'relative'} 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'z-50' : 'z-10'}
        transition-transform duration-300 ease-in-out h-full
      `}>
        <ChatSidebar
          currentChatId={currentChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          collapsed={false}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`
        flex-1 flex flex-col
        ${isMobile && sidebarOpen ? 'opacity-50' : 'opacity-100'}
        transition-opacity duration-300
      `}>
        <ChatInterface
          chatId={currentChatId}
          onChatCreated={handleChatCreated}
        />
      </div>
    </div>
  );
}
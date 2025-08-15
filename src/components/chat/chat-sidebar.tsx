import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Settings, LogOut, MessageSquare, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AIADMKLogo } from '@/components/ui/aiadmk-logo';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  collapsed?: boolean;
}

export function ChatSidebar({ currentChatId, onChatSelect, onNewChat, collapsed = false }: ChatSidebarProps) {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'அரட்டைகளை ஏற்ற முடியவில்லை' : 'Failed to load chats',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (collapsed) {
    return (
      <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 space-y-4">
        <AIADMKLogo className="w-8 h-8" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="hover-glow"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/settings')}
          className="hover-glow"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3 mb-4">
          <AIADMKLogo className="w-8 h-8" />
          <h1 className="text-lg font-semibold text-sidebar-foreground tamil-text">
            ChatAIADMK
          </h1>
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-primary hover:bg-primary/90 hover-glow transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'ta' ? 'புதிய அரட்டை' : 'New Chat'}
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ta' ? 'அரட்டைகளைத் தேடுங்கள்...' : 'Search chats...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-sidebar-accent/50 border-sidebar-border/50"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              {language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading...'}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery 
                ? (language === 'ta' ? 'அரட்டைகள் எதுவும் கிடைக்கவில்லை' : 'No chats found')
                : (language === 'ta' ? 'அரட்டைகள் எதுவும் இல்லை' : 'No chats yet')
              }
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-sidebar-accent group ${
                  currentChatId === chat.id 
                    ? 'bg-sidebar-accent border border-sidebar-border' 
                    : 'hover:bg-sidebar-accent/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-sidebar-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sidebar-foreground truncate tamil-text">
                      {chat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.updated_at).toLocaleDateString(
                        language === 'ta' ? 'ta-IN' : 'en-US'
                      )}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              className="h-8 w-8 hover-glow"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 hover-glow"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
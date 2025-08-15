import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Copy, Trash2, Pin, RotateCcw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  language: 'ta' | 'en';
  is_pinned: boolean;
  created_at: string;
}

interface ChatInterfaceProps {
  chatId?: string;
  onChatCreated?: (chatId: string) => void;
}

export function ChatInterface({ chatId, onChatCreated }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { language, detectLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'செய்திகளை ஏற்ற முடியவில்லை' : 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const createNewChat = async (firstMessage: string) => {
    if (!user) return null;

    try {
      // Auto-generate title from first message
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 50) + '...'
        : firstMessage;

      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            user_id: user.id,
            title: title,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  const addMessage = async (chatId: string, role: 'user' | 'assistant', content: string, detectedLanguage: 'ta' | 'en') => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            role,
            content,
            language: detectedLanguage,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const detectedLang = detectLanguage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      let currentChatId = chatId;

      // Create new chat if none exists
      if (!currentChatId) {
        currentChatId = await createNewChat(userMessage);
        if (currentChatId && onChatCreated) {
          onChatCreated(currentChatId);
        }
      }

      if (!currentChatId) {
        throw new Error('Failed to create chat');
      }

      // Add user message
      const userMsg = await addMessage(currentChatId, 'user', userMessage, detectedLang);
      setMessages(prev => [...prev, userMsg as Message]);

      // Check if we need to ask for language preference
      if (detectedLang === 'en' && language === 'ta') {
        const languagePrompt = language === 'ta' 
          ? 'நீங்கள் ஆங்கிலத்தில் கேள்வி கேட்டுள்ளீர்கள். நான் தமிழில் பதில் சொல்லட்டுமா அல்லது ஆங்கிலத்தில் பதில் சொல்லட்டுமா?'
          : 'You asked in English. Would you like me to reply in Tamil or English?';

        const langMsg = await addMessage(currentChatId, 'assistant', languagePrompt, 'ta');
        setMessages(prev => [...prev, langMsg as Message]);
        setIsLoading(false);
        return;
      }

      // Simulate AI response (replace with actual API call)
      setIsStreaming(true);
      setTimeout(async () => {
        const aiResponse = generateAIResponse(userMessage, detectedLang);
        const assistantMsg = await addMessage(currentChatId!, 'assistant', aiResponse, detectedLang);
        setMessages(prev => [...prev, assistantMsg as Message]);
        setIsStreaming(false);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'செய்தியை அனுப்ப முடியவில்லை' : 'Failed to send message',
        variant: 'destructive',
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const generateAIResponse = (message: string, lang: 'ta' | 'en') => {
    // This is a mock response - replace with actual AI integration
    const responses = {
      ta: [
        'AIADMK பற்றிய உங்கள் கேள்விக்கு நான் உதவ முயற்சிக்கிறேன். மேலும் குறிப்பிட்ட தகவல்களுக்கு, தயவுசெய்து உங்கள் கேள்வியை தெளிவாக்கவும்.',
        'AIADMK கட்சியின் கொள்கைகள் மற்றும் செயல்பாடுகள் குறித்து மேலும் அறிய விரும்புகிறீர்களா?',
        'தமிழ்நாட்டின் அரசியல் வரலாற்றில் AIADMK முக்கிய பங்கு வகித்துள்ளது. எந்த குறிப்பிட்ட விषயத்தில் தகவல் வேண்டும்?'
      ],
      en: [
        'I can help you with information about AIADMK. Please specify your question for more detailed information.',
        'Would you like to know more about AIADMK policies and activities?',
        'AIADMK has played a significant role in Tamil Nadu politics. What specific topic would you like to know about?'
      ]
    };

    const responseArray = responses[lang];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const copyMessage = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      title: language === 'ta' ? 'நகலெடுக்கப்பட்டது' : 'Copied',
      description: language === 'ta' ? 'செய்தி நகலெடுக்கப்பட்டது' : 'Message copied to clipboard',
    });
  };

  const togglePin = async (messageId: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_pinned: !isPinned })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_pinned: !isPinned } : msg
        )
      );

      toast({
        title: language === 'ta' ? 'வெற்றி' : 'Success',
        description: !isPinned 
          ? (language === 'ta' ? 'செய்தி பின் செய்யப்பட்டது' : 'Message pinned')
          : (language === 'ta' ? 'செய்தி பின் நீக்கப்பட்டது' : 'Message unpinned'),
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const stopGeneration = () => {
    setIsStreaming(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && !chatId && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground tamil-text">
                {language === 'ta' ? 'AIADMK AI உதவியாளர்' : 'AIADMK AI Assistant'}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto tamil-text">
                {language === 'ta' 
                  ? 'AIADMK பற்றிய உங்கள் கேள்விகளைக் கேளுங்கள். நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன்.'
                  : 'Ask me anything about AIADMK. I\'m here to help you with accurate information.'
                }
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 relative group ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                } ${message.is_pinned ? 'ring-2 ring-neon' : ''}`}
              >
                <div className="prose prose-sm max-w-none tamil-text">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Message actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-background/10"
                    onClick={() => copyMessage(message.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-background/10"
                    onClick={() => togglePin(message.id, message.is_pinned)}
                  >
                    <Pin className={`h-3 w-3 ${message.is_pinned ? 'text-neon' : ''}`} />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(message.created_at).toLocaleTimeString(
                    message.language === 'ta' ? 'ta-IN' : 'en-US',
                    { hour: '2-digit', minute: '2-digit' }
                  )}
                </div>
              </div>
            </div>
          ))}

          {isStreaming && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-4 bg-card border border-border">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse text-muted-foreground">
                    {language === 'ta' ? 'பதில் தயாரிக்கிறேன்...' : 'Generating response...'}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopGeneration}
                    className="text-destructive hover:text-destructive"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    {language === 'ta' ? 'நிறுத்து' : 'Stop'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'ta' 
                  ? 'AIADMK பற்றி கேளுங்கள்...'
                  : 'Ask about AIADMK...'
                }
                className="min-h-[60px] max-h-[200px] pr-12 bg-card border-border/50 tamil-text resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 flex space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover-glow"
                  disabled={isLoading}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 hover-glow"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="tamil-text">
                {language === 'ta' 
                  ? 'Enter அனுப்ப, Shift+Enter புதிய வரிசைக்கு'
                  : 'Press Enter to send, Shift+Enter for new line'
                }
              </span>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs hover-glow"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  {language === 'ta' ? 'மீண்டும் உருவாக்கு' : 'Regenerate'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AIADMKLogo } from '@/components/ui/aiadmk-logo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      // If logged in, go to app with the search query
      navigate('/app', { state: { initialQuery: searchQuery } });
    } else {
      // If not logged in, go to auth page
      navigate('/auth');
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 bg-pattern relative overflow-hidden">
      {/* Background polygon lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          <defs>
            <pattern id="polygon-lines" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path
                d="M60 10 L100 40 L100 80 L60 110 L20 80 L20 40 Z"
                fill="none"
                stroke="hsl(var(--neon-glow))"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#polygon-lines)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <AIADMKLogo className="w-8 h-8" />
            <span className="text-xl font-bold text-neon tamil-text">ChatAIADMK</span>
          </div>
          <div className="flex space-x-3">
            {!user && (
              <>
                <Button variant="ghost" onClick={handleSignIn} className="hover-glow">
                  {language === 'ta' ? 'உள்நுழையுங்கள்' : 'Sign In'}
                </Button>
                <Button onClick={handleSignIn} className="hover-glow">
                  {language === 'ta' ? 'பதிவு செய்யுங்கள்' : 'Sign Up'}
                </Button>
              </>
            )}
            {user && (
              <Button onClick={() => navigate('/app')} className="hover-glow">
                {language === 'ta' ? 'அரட்டைக்குச் செல்லுங்கள்' : 'Go to Chat'}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="container mx-auto max-w-4xl text-center space-y-12">
          {/* Logo and Title */}
          <div className="space-y-8 animate-fade-in">
            <AIADMKLogo className="w-32 h-32 mx-auto" animated />
            
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold text-neon leading-tight tamil-text">
                ChatAIADMK
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto tamil-text">
                {language === 'ta' 
                  ? 'முன்னேறிய புத்திசாலித்தனத்துடன் உலகத்தைப் புரிந்துகொள்ளும் AI'
                  : 'AI that understands the universe with advanced intelligence'
                }
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in">
            <form onSubmit={handleSubmit} className="relative">
              <div className="glass rounded-2xl p-1 border border-border/30">
                <div className="relative">
                  <Textarea
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ta' 
                      ? 'AIADMK பற்றி கேளுங்கள்...'
                      : 'Ask about AIADMK...'
                    }
                    className="min-h-[60px] border-0 bg-transparent resize-none focus:ring-0 text-lg tamil-text placeholder:text-muted-foreground/60"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="absolute right-3 bottom-3 flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover-glow"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-10 w-10 bg-primary hover:bg-primary/90 hover-glow animate-neon-pulse"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            {[
              language === 'ta' ? 'AIADMK வரலாறு' : 'AIADMK History',
              language === 'ta' ? 'கொள்கைகள்' : 'Policies',
              language === 'ta' ? 'நிகழ்வுகள்' : 'Events',
              language === 'ta' ? 'தலைவர்கள்' : 'Leaders',
              language === 'ta' ? 'சாதனைகள்' : 'Achievements',
            ].map((feature, index) => (
              <Button
                key={index}
                variant="outline"
                className="glass border-border/30 hover:border-neon/50 hover-glow transition-all duration-300 tamil-text"
                onClick={() => setSearchQuery(feature)}
              >
                {feature}
              </Button>
            ))}
          </div>

          {/* Call to Action */}
          <div className="space-y-4 animate-fade-in">
            <p className="text-muted-foreground tamil-text">
              {language === 'ta' 
                ? 'தமிழ் மற்றும் ஆங்கிலத்தில் கேள்விகள் கேளுங்கள்'
                : 'Ask questions in Tamil and English'
              }
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleSignIn}
                  className="bg-primary hover:bg-primary/90 hover-glow text-lg px-8 py-3 tamil-text"
                >
                  {language === 'ta' ? 'இலவசமாகத் தொடங்குங்கள்' : 'Get Started Free'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSignIn}
                  className="glass border-border/50 hover:border-neon/50 hover-glow text-lg px-8 py-3 tamil-text"
                >
                  {language === 'ta' ? 'மேலும் அறியுங்கள்' : 'Learn More'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 p-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-6 mb-4 tamil-text">
            <button 
              onClick={() => navigate('/privacy')}
              className="hover:text-neon transition-colors"
            >
              {language === 'ta' ? 'தனியுரிமை' : 'Privacy'}
            </button>
            <button 
              onClick={() => navigate('/terms')}
              className="hover:text-neon transition-colors"
            >
              {language === 'ta' ? 'நிபந்தனைகள்' : 'Terms'}
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="hover:text-neon transition-colors"
            >
              {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
            </button>
          </div>
          <p className="tamil-text">
            © 2024 ChatAIADMK. {language === 'ta' ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன்.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
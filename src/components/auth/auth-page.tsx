import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { AIADMKLogo } from '@/components/ui/aiadmk-logo';
import { useLanguage } from '@/hooks/useLanguage';

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { language } = useLanguage();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      
      if (error) {
        toast({
          title: language === 'ta' ? 'பிழை' : 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'ஏதோ தவறு நடந்தது' : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      
      if (error) {
        toast({
          title: language === 'ta' ? 'பிழை' : 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'ஏதோ தவறு நடந்தது' : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
          },
        });

        if (error) {
          toast({
            title: language === 'ta' ? 'பிழை' : 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: language === 'ta' ? 'வெற்றி' : 'Success',
            description: language === 'ta' 
              ? 'உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்' 
              : 'Please check your email to verify your account',
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: language === 'ta' ? 'பிழை' : 'Error',
            description: error.message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'ஏதோ தவறு நடந்தது' : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <AIADMKLogo className="w-20 h-20 mx-auto" animated />
          <div>
            <h1 className="text-3xl font-bold text-neon tamil-text">
              {language === 'ta' ? 'ChatAIADMK' : 'ChatAIADMK'}
            </h1>
            <p className="text-muted-foreground mt-2 tamil-text">
              {language === 'ta' 
                ? 'முன்னேறிய புத்திசாலித்தனத்துடன் உலகத்தைப் புரிந்துகொள்ளும் AI'
                : 'AI that understands the universe with advanced intelligence'
              }
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-center tamil-text">
              {isSignUp 
                ? (language === 'ta' ? 'பதிவு செய்யுங்கள்' : 'Sign Up')
                : (language === 'ta' ? 'உள்நுழையுங்கள்' : 'Sign In')
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full hover-glow transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {language === 'ta' ? 'Google மூலம் தொடரவும்' : 'Continue with Google'}
              </Button>

              <Button
                onClick={handleAppleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full hover-glow transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                {language === 'ta' ? 'Apple மூலம் தொடரவும்' : 'Continue with Apple'}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {language === 'ta' ? 'அல்லது' : 'or'}
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <Input
                type="email"
                placeholder={language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input/50 border-border/50"
              />
              <Input
                type="password"
                placeholder={language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input/50 border-border/50"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 hover-glow transition-all duration-300"
              >
                {isSignUp 
                  ? (language === 'ta' ? 'பதிவு செய்யுங்கள்' : 'Sign Up')
                  : (language === 'ta' ? 'உள்நுழையுங்கள்' : 'Sign In')
                }
              </Button>
            </form>

            {/* Toggle between Sign In/Sign Up */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp 
                  ? (language === 'ta' 
                      ? 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையுங்கள்'
                      : 'Already have an account? Sign in'
                    )
                  : (language === 'ta' 
                      ? 'கணக்கு இல்லையா? பதிவு செய்யுங்கள்'
                      : "Don't have an account? Sign up"
                    )
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
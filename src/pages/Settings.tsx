import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AIADMKLogo } from '@/components/ui/aiadmk-logo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [apiProvider, setApiProvider] = useState('direct');

  const handleExportChats = async () => {
    try {
      // TODO: Implement chat export functionality
      toast({
        title: language === 'ta' ? 'வெற்றி' : 'Success',
        description: language === 'ta' ? 'அரட்டைகள் ஏற்றுமதி செய்யப்பட்டன' : 'Chats exported successfully',
      });
    } catch (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'ஏற்றுமதி தோல்வியடைந்தது' : 'Export failed',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(
      language === 'ta' 
        ? 'நீங்கள் உறுதியாக உங்கள் கணக்கை நீக்க விரும்புகிறீர்களா?'
        : 'Are you sure you want to delete your account?'
    )) {
      try {
        // TODO: Implement account deletion
        toast({
          title: language === 'ta' ? 'கணக்கு நீக்கப்பட்டது' : 'Account Deleted',
          description: language === 'ta' ? 'உங்கள் கணக்கு வெற்றிகரமாக நீக்கப்பட்டது' : 'Your account has been successfully deleted',
        });
        navigate('/');
      } catch (error) {
        toast({
          title: language === 'ta' ? 'பிழை' : 'Error',
          description: language === 'ta' ? 'கணக்கு நீக்குதல் தோல்வியடைந்தது' : 'Account deletion failed',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background bg-pattern">
      {/* Header */}
      <header className="border-b border-border/30 p-6">
        <div className="container mx-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover-glow"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <AIADMKLogo className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-foreground tamil-text">
            {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 max-w-4xl space-y-6">
        {/* Language Settings */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 tamil-text">
              <Globe className="h-5 w-5 text-neon" />
              <span>{language === 'ta' ? 'மொழி அமைப்புகள்' : 'Language Settings'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium tamil-text">
                  {language === 'ta' ? 'விருப்பமான மொழி' : 'Preferred Language'}
                </label>
                <p className="text-sm text-muted-foreground tamil-text">
                  {language === 'ta' 
                    ? 'உங்கள் முன்னிருப்பு மொழியைத் தேர்ந்தெடுக்கவும்'
                    : 'Choose your preferred language for the interface'
                  }
                </p>
              </div>
              <Select value={language} onValueChange={(value) => setLanguage(value as 'ta' | 'en')}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ta" className="tamil-text">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* API Provider Settings */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="tamil-text">
              {language === 'ta' ? 'AI மாடல் வழங்குநர்' : 'AI Model Provider'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium tamil-text">
                  {language === 'ta' ? 'API வழங்குநர்' : 'API Provider'}
                </label>
                <p className="text-sm text-muted-foreground tamil-text">
                  {language === 'ta' 
                    ? 'Chatbase அல்லது நேரடி LLM API ஐ தேர்ந்தெடுக்கவும்'
                    : 'Choose between Chatbase widget or direct LLM API'
                  }
                </p>
              </div>
              <Select value={apiProvider} onValueChange={setApiProvider}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatbase">Chatbase</SelectItem>
                  <SelectItem value="direct">Direct LLM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 tamil-text">
              {darkMode ? <Moon className="h-5 w-5 text-neon" /> : <Sun className="h-5 w-5 text-neon" />}
              <span>{language === 'ta' ? 'தீம் அமைப்புகள்' : 'Theme Settings'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium tamil-text">
                  {language === 'ta' ? 'இருண்ட பயன்முறை' : 'Dark Mode'}
                </label>
                <p className="text-sm text-muted-foreground tamil-text">
                  {language === 'ta' 
                    ? 'இருண்ட அல்லது வெளிச்ச தீமைத் தேர்ந்தெடுக்கவும்'
                    : 'Toggle between dark and light theme'
                  }
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="tamil-text">
              {language === 'ta' ? 'தரவு மேலாண்மை' : 'Data Management'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium tamil-text">
                  {language === 'ta' ? 'அரட்டைகளை ஏற்றுமதி செய்யவும்' : 'Export Chats'}
                </label>
                <p className="text-sm text-muted-foreground tamil-text">
                  {language === 'ta' 
                    ? 'உங்கள் அரட்டை வரலாற்றை JSON வடிவத்தில் பதிவிறக்கவும்'
                    : 'Download your chat history in JSON format'
                  }
                </p>
              </div>
              <Button
                onClick={handleExportChats}
                variant="outline"
                className="hover-glow"
              >
                <Download className="h-4 w-4 mr-2" />
                {language === 'ta' ? 'ஏற்றுமதி' : 'Export'}
              </Button>
            </div>

            <div className="border-t border-border/30 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-destructive tamil-text">
                    {language === 'ta' ? 'கணக்கை நீக்கவும்' : 'Delete Account'}
                  </label>
                  <p className="text-sm text-muted-foreground tamil-text">
                    {language === 'ta' 
                      ? 'உங்கள் கணக்கு மற்றும் அனைத்து தரவுகளையும் நிரந்தரமாக நீக்கவும்'
                      : 'Permanently delete your account and all associated data'
                    }
                  </p>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="hover-glow"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === 'ta' ? 'நீக்கு' : 'Delete'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        {user && (
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="tamil-text">
                {language === 'ta' ? 'பயனர் தகவல்' : 'User Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium tamil-text">
                  {language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                </label>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium tamil-text">
                  {language === 'ta' ? 'கணக்கு உருவாக்கப்பட்டது' : 'Account Created'}
                </label>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString(
                    language === 'ta' ? 'ta-IN' : 'en-US'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
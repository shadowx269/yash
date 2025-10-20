import { Heart, Search, User, LogOut, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCurrentUser, saveCurrentUser } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    saveCurrentUser(null);
    setUser(null);
    navigate('/');
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Debounce search propagation to parent for better performance
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b-2 shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Mobile-first layout */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo - smaller on mobile */}
          <Link to="/" className="flex-shrink-0 group transition-all hover:scale-105">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Priya's Collection
            </h1>
          </Link>

          {/* Action buttons - optimized for mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>

            {user && (
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all rounded-full h-8 w-8 sm:h-10 sm:w-10 shadow-sm">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </Button>
              </Link>
            )}

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10 rounded-full shadow-sm font-semibold text-xs sm:text-sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive rounded-full transition-all h-8 w-8 sm:h-10 sm:w-10 shadow-sm">
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-full transition-all h-8 w-8 sm:h-10 sm:w-10 shadow-sm">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search bar - always visible, mobile-first */}
        <div className="mt-3 sm:mt-4">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 sm:pl-12 h-9 sm:h-11 rounded-full border-2 focus-visible:border-primary shadow-sm transition-all text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
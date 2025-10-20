import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Home, Shield, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser, saveCurrentUser, CATEGORIES } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface AppSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'discount-desc';
  onSortChange: (sort: 'relevance' | 'price-asc' | 'price-desc' | 'discount-desc') => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  productCount: number;
  totalCount: number;
}

export const AppSidebar = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  onClearFilters,
  hasActiveFilters,
  productCount,
  totalCount,
}: AppSidebarProps) => {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    saveCurrentUser(null);
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <aside className="w-full h-full bg-card border-r flex flex-col">
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account
          </h2>
          <div className="space-y-2">
            {user ? (
              <>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  {user.role === 'admin' && (
                    <Badge variant="secondary" className="mt-2">
                      Admin
                    </Badge>
                  )}
                </div>
                <Link to="/" className="block">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link to="/wishlist" className="block">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/" className="block">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link to="/login" className="block">
                  <Button variant="default" className="w-full justify-start" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login / Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">
                {productCount} of {totalCount} products
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Category</h3>
              <div className="space-y-1">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    className="w-full justify-start text-sm"
                    size="sm"
                    onClick={() => onSelectCategory(category)}
                  >
                    {category}
                    {selectedCategory === category && (
                      <Badge variant="secondary" className="ml-auto">
                        ✓
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3">Price Range</h3>
              <div className="space-y-3">
                <div className="px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-bold text-primary text-center">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </p>
                </div>
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(v) => onPriceRangeChange([v[0], v[1]])}
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  className="px-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{minPrice.toLocaleString()}</span>
                  <span>₹{maxPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3">Sort By</h3>
              <Select value={sortBy} onValueChange={(v) => onSortChange(v as typeof sortBy)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="discount-desc">Discount: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Home, Shield, Filter, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser, saveCurrentUser, CATEGORIES } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileSheet?: boolean;
  onMobileClose?: () => void;
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
  isCollapsed,
  onToggle,
  isMobileSheet = false,
  onMobileClose,
}: AppSidebarProps) => {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange);
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempSortBy, setTempSortBy] = useState(sortBy);

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

  useEffect(() => {
    setTempPriceRange(priceRange);
    setTempCategory(selectedCategory);
    setTempSortBy(sortBy);
  }, [priceRange, selectedCategory, sortBy]);

  const handleApplyFilters = () => {
    onPriceRangeChange(tempPriceRange);
    onSelectCategory(tempCategory);
    onSortChange(tempSortBy);
    if (isMobileSheet && onMobileClose) {
      onMobileClose();
    }
  };

  const handleResetFilters = () => {
    setTempPriceRange([minPrice, maxPrice]);
    setTempCategory('All');
    setTempSortBy('relevance');
    onClearFilters();
    if (isMobileSheet && onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    saveCurrentUser(null);
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <aside className={cn("h-full bg-card flex flex-col transition-all duration-300 relative", isMobileSheet ? "border-0" : "border-r", isCollapsed ? "w-16" : "w-full")}>
      {!isMobileSheet && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-4 z-50 h-8 w-8 rounded-full border-2 bg-card shadow-lg hover:bg-accent hover:scale-110 transition-all duration-200"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}

      {isMobileSheet && (
        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters & Sort
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Showing {productCount} of {totalCount} products
          </p>
        </div>
      )}

      <div className={cn("space-y-4 sm:space-y-6 flex-1 overflow-y-auto", isCollapsed ? "p-2" : isMobileSheet ? "p-4" : "p-4 lg:p-6")}>
        {!isCollapsed && !isMobileSheet && (
          <div>
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Account
            </h2>
            <div className="space-y-1.5 sm:space-y-2">
              {user ? (
                <>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs sm:text-sm font-medium truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <Badge variant="secondary" className="mt-1.5 sm:mt-2 text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full justify-start h-9 text-sm" size="sm">
                      <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/wishlist" className="block">
                    <Button variant="ghost" className="w-full justify-start h-9 text-sm" size="sm">
                      <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Wishlist
                    </Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block">
                      <Button variant="ghost" className="w-full justify-start h-9 text-sm" size="sm">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-9 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full justify-start h-9 text-sm" size="sm">
                      <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button variant="default" className="w-full justify-start h-9 text-sm" size="sm">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      Login / Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {isCollapsed && !isMobileSheet && (
          <div className="space-y-2">
            {user ? (
              <>
                <Link to="/" title="Home">
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/wishlist" title="Wishlist">
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <Heart className="h-4 w-4" />
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" title="Admin">
                    <Button variant="ghost" size="icon" className="w-full h-10">
                      <Shield className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-full h-10 text-destructive hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/" title="Home">
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login" title="Login">
                  <Button variant="default" size="icon" className="w-full h-10">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}

        {!isCollapsed && !isMobileSheet && <Separator />}

        {!isCollapsed ? (
          <div>
            {!isMobileSheet && (
              <>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
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
                      Reset
                    </Button>
                  )}
                </div>

                {hasActiveFilters && (
                  <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs sm:text-sm font-medium">
                      {productCount} of {totalCount} products
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Category</h3>
                <div className="space-y-1">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={(isMobileSheet ? tempCategory : selectedCategory) === category ? 'default' : 'ghost'}
                      className="w-full justify-start text-xs sm:text-sm h-9 transition-all"
                      size="sm"
                      onClick={() => isMobileSheet ? setTempCategory(category) : onSelectCategory(category)}
                    >
                      {category}
                      {(isMobileSheet ? tempCategory : selectedCategory) === category && (
                        <Check className="h-3.5 w-3.5 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Price Range</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <p className="text-xs sm:text-sm font-bold text-primary text-center">
                      ₹{(isMobileSheet ? tempPriceRange[0] : priceRange[0]).toLocaleString()} - ₹{(isMobileSheet ? tempPriceRange[1] : priceRange[1]).toLocaleString()}
                    </p>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={isMobileSheet ? [tempPriceRange[0], tempPriceRange[1]] : [priceRange[0], priceRange[1]]}
                      onValueChange={(v) => isMobileSheet ? setTempPriceRange([v[0], v[1]]) : onPriceRangeChange([v[0], v[1]])}
                      min={minPrice}
                      max={maxPrice}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>₹{minPrice.toLocaleString()}</span>
                    <span>₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Sort By</h3>
                <Select value={isMobileSheet ? tempSortBy : sortBy} onValueChange={(v) => isMobileSheet ? setTempSortBy(v as typeof sortBy) : onSortChange(v as typeof sortBy)}>
                  <SelectTrigger className="w-full h-10 text-sm">
                    <SelectValue placeholder="Sort products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance" className="text-sm">Relevance</SelectItem>
                    <SelectItem value="price-asc" className="text-sm">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc" className="text-sm">Price: High to Low</SelectItem>
                    <SelectItem value="discount-desc" className="text-sm">Discount: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-10"
              title="Filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isMobileSheet && (
        <div className="border-t bg-card p-4 space-y-2">
          <Button
            onClick={handleApplyFilters}
            className="w-full h-11 text-sm font-semibold"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="w-full h-11 text-sm font-semibold"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      )}
    </aside>
  );
};

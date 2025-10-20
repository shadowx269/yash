import { Heart } from 'lucide-react';
import { Product, getCurrentUser, getWishlist, saveWishlist } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const wishlist = getWishlist(user.id);
      setIsWishlisted(wishlist.includes(product.id));
    }
  }, [user, product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    const wishlist = getWishlist(user.id);
    const newWishlist = isWishlisted
      ? wishlist.filter((id) => id !== product.id)
      : [...wishlist, product.id];

    saveWishlist(user.id, newWishlist);
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-glow-lg transition-all duration-500 hover:-translate-y-1 active:scale-[0.98] rounded-xl sm:rounded-2xl border-2 hover:border-primary/20 animate-fade-in"
      onClick={() => onSelect(product)}
      aria-label={product.name}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNzUgMzUwSDMyNVY0NTBIMjc1VjM1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwMCAyNzVMMzI1IDMwMEwyNzUgMzAwTDMwMCAyNzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iNTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 h-7 w-7 sm:h-9 sm:w-9 bg-background/95 hover:bg-background backdrop-blur-sm transition-all duration-300 rounded-full shadow-md hover:scale-110 active:scale-95 ${isWishlisted ? 'text-primary' : 'text-muted-foreground'
              }`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all ${isWishlisted ? 'fill-current scale-110' : ''}`} />
          </Button>
          {product.discountPercent > 0 && (
            <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 text-xs sm:text-sm bg-accent text-accent-foreground font-bold shadow-md px-1.5 py-0.5 sm:px-2 sm:py-1">
              {product.discountPercent}% OFF
            </Badge>
          )}
          {!product.stock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-xs sm:text-sm px-2.5 py-1 sm:px-4 sm:py-2">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 flex items-center justify-between gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {product.colors?.slice(0, 3).map((c, i) => (
                <span key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <button
              type="button"
              className="pointer-events-auto text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-background/90 border shadow-sm hover:shadow-md active:scale-95 transition-transform"
              aria-label="Quick view"
            >
              Quick View
            </button>
          </div>
        </div>
        <div className="p-2.5 sm:p-3 lg:p-4 space-y-1 sm:space-y-1.5">
          <h3 className="font-heading font-semibold text-xs sm:text-sm line-clamp-2 mb-0.5 sm:mb-1 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
          {product.fabric && (
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">{product.fabric}</p>
          )}
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-primary">₹{product.discountPrice}</span>
            {product.discountPercent > 0 && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {product.stock && (
            <p className="text-[10px] sm:text-xs font-semibold text-green-600 mt-1 sm:mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full animate-pulse"></span>
              In Stock
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
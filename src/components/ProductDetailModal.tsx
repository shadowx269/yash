import { useState, useEffect, useCallback } from 'react';
import { X, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, getCurrentUser, getWishlist, saveWishlist } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  // Always call useCallback hooks, but make them safe for when product is null
  const nextImage = useCallback(() => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  }, [product?.images?.length]);

  const prevImage = useCallback(() => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  }, [product?.images?.length]);

  useEffect(() => {
    if (user && product) {
      const wishlist = getWishlist(user.id);
      setIsWishlisted(wishlist.includes(product.id));
    }
  }, [user, product]);

  // Keyboard navigation - always call this hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product, nextImage, prevImage, onClose]);

  // Debug logging
  console.log('ProductDetailModal - product:', product);
  console.log('ProductDetailModal - product images:', product?.images);

  if (!product) {
    console.log('ProductDetailModal - No product, returning null');
    return null;
  }

  const toggleWishlist = () => {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  console.log('ProductDetailModal - Rendering dialog with product:', product.name);

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 w-[95vw] sm:w-[90vw] md:w-full">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto">
          <div className="lg:w-1/2 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-muted/30 to-muted/10">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="relative aspect-[3/4] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 sm:p-3 lg:p-4"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwMCAxMjVMMjI1IDE1MEwxNzUgMTUwTDIwMCAxMjVaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />

                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-1.5 sm:left-2 lg:left-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm active:scale-95 transition-transform"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1.5 sm:right-2 lg:right-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm active:scale-95 transition-transform"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </>
                )}

                {product.images.length > 1 && (
                  <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${currentImageIndex === index
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-muted hover:border-primary/50'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 p-3 sm:p-4 lg:p-6 flex flex-col justify-between">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">{product.name}</h2>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {product.category}
                  </Badge>
                  {product.fabric && (
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {product.fabric}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">₹{product.discountPrice}</span>
                  {product.discountPercent > 0 && (
                    <span className="text-base sm:text-lg lg:text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                {product.discountPercent > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1">
                    {product.discountPercent}% OFF
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {product.stock ? (
                  <Badge className="bg-green-500 text-white flex items-center gap-1 text-xs sm:text-sm">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1 text-xs sm:text-sm">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    Out of Stock
                  </Badge>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-semibold">Description</h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold">Available Sizes</h3>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {product.sizes.map((size, index) => (
                      <div
                        key={index}
                        className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold">Available Colors</h3>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-muted shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={toggleWishlist}
                  variant={isWishlisted ? "default" : "outline"}
                  className="flex-1 h-10 sm:h-11 lg:h-12 text-sm sm:text-base font-semibold"
                  disabled={!product.stock}
                >
                  <Heart className={`mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Add to Wishlist'}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="h-10 sm:h-11 lg:h-12 px-4 sm:px-6 text-sm sm:text-base"
                  disabled={!product.stock}
                >
                  <Share2 className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>

              {!product.stock && (
                <div className="text-center py-3 sm:py-4 bg-muted/50 rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">This item is currently out of stock</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
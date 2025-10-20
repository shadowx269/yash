import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Product, getProducts, getWishlist, getCurrentUser } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const allProducts = getProducts();
    const wishlistIds = getWishlist(user.id);
    const filtered = allProducts.filter((p) => wishlistIds.includes(p.id));
    setWishlistProducts(filtered);
  }, [user, navigate]);

  useEffect(() => {
    // Refresh wishlist when localStorage changes
    const handleStorageChange = () => {
      if (user) {
        const allProducts = getProducts();
        const wishlistIds = getWishlist(user.id);
        const filtered = allProducts.filter((p) => wishlistIds.includes(p.id));
        setWishlistProducts(filtered);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <Header onSearch={() => { }} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="h-10 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <div>
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {wishlistProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} onSelect={setSelectedProduct} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-3 text-foreground">Your wishlist is empty!</h2>
            <p className="text-muted-foreground text-lg mb-8">Discover amazing products and save your favorites</p>
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
            >
              Browse Products
            </Button>
          </div>
        )}
      </main>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </div>
  );
}

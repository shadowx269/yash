import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { CategoryChips } from '@/components/CategoryChips';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Product, getProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Footer } from '@/components/Footer';
import { FeaturedCategories } from '@/components/FeaturedCategories';
import { PromoBanner } from '@/components/PromoBanner';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RotateCcw, Filter } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount-desc'>('relevance');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Derive price bounds from data
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = products.map((p) => p.discountPrice);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [products]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
    setIsLoading(false);
    // Initialize filters from URL if present
    const urlCategory = searchParams.get('cat');
    const urlQuery = searchParams.get('q');
    const urlSort = searchParams.get('sort') as typeof sortBy | null;
    const urlPrice = searchParams.get('price'); // format: min-max
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlQuery) setSearchQuery(urlQuery);
    if (urlSort && ['relevance', 'price-asc', 'price-desc', 'discount-desc'].includes(urlSort)) {
      setSortBy(urlSort);
    }
    if (urlPrice) {
      const [min, max] = urlPrice.split('-').map((v) => parseInt(v, 10));
      if (!Number.isNaN(min) && !Number.isNaN(max)) setPriceRange([min, max]);
    }
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    const [min, max] = priceRange;
    if (min || max) {
      filtered = filtered.filter((p) => p.discountPrice >= min && p.discountPrice <= max);
    }

    // Sorting
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.discountPrice - b.discountPrice);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.discountPrice - a.discountPrice);
    if (sortBy === 'discount-desc') sorted.sort((a, b) => b.discountPercent - a.discountPercent);

    setFilteredProducts(sorted);
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  // Initialize price range once prices are known
  useEffect(() => {
    if (minPrice !== 0 || maxPrice !== 0) {
      setPriceRange((prev) => (prev[0] === 0 && prev[1] === 0 ? [minPrice, maxPrice] : prev));
    }
  }, [minPrice, maxPrice]);

  // Sync URL parameters
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory && selectedCategory !== 'All') params.cat = selectedCategory;
    if (searchQuery) params.q = searchQuery;
    if (sortBy !== 'relevance') params.sort = sortBy;
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) {
      params.price = `${priceRange[0]}-${priceRange[1]}`;
    }
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, sortBy, priceRange, minPrice, maxPrice, setSearchParams]);

  const trendingProducts = products.filter((p) => p.trending);

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('relevance');
    setPriceRange([minPrice, maxPrice]);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== 'All' ||
    searchQuery !== '' ||
    sortBy !== 'relevance' ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <Header onSearch={setSearchQuery} />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8 lg:space-y-12">
        <Breadcrumb />

        {/* Hero Carousel */}
        <AnimatedSection animation="scaleIn">
          <HeroCarousel />
        </AnimatedSection>

        <AnimatedSection>
          <PromoBanner />
        </AnimatedSection>

        {/* Stats Bar removed per request */}

        <AnimatedSection>
          <FeaturedCategories />
        </AnimatedSection>

        {/* Enhanced Filters Bar */}
        <div className="space-y-4 sm:space-y-6">
          <CategoryChips selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

          {/* Filter Controls */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {filteredProducts.length} of {products.length} products
                </span>
              </div>
              <Button
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear Filters
              </Button>
            </div>
          )}

          {/* Advanced Filters Section */}
          <div className="space-y-4">
            {/* Price Range Filter */}
            <div className="group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                    <span className="text-sm sm:text-base font-semibold text-foreground">Price Range</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <span className="text-xs sm:text-sm font-bold text-primary">
                      ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={(v) => setPriceRange([v[0], v[1]])}
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
            </div>

            {/* Sort Filter */}
            <div className="group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <span className="text-sm sm:text-base font-semibold text-foreground">Sort Products</span>
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-full h-10 sm:h-12 bg-background/50 border-primary/20 focus:border-primary transition-colors">
                    <SelectValue placeholder="Choose sorting option" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                    <SelectItem value="relevance" className="hover:bg-primary/10 focus:bg-primary/10">
                      <div className="flex items-center gap-2">
                        <span>🎯</span>
                        <span>Relevance</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="price-asc" className="hover:bg-primary/10 focus:bg-primary/10">
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span>Price: Low to High</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="price-desc" className="hover:bg-primary/10 focus:bg-primary/10">
                      <div className="flex items-center gap-2">
                        <span>💎</span>
                        <span>Price: High to Low</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="discount-desc" className="hover:bg-primary/10 focus:bg-primary/10">
                      <div className="flex items-center gap-2">
                        <span>🔥</span>
                        <span>Discount: High to Low</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Products */}
        {trendingProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-1 sm:h-10 sm:w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Trending Now
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Most popular items this week</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 self-start sm:self-auto">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-semibold text-primary">Hot Picks</span>
              </div>
            </div>
            <div className="relative">
              <div className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-3 sm:-mx-4 px-3 sm:px-4">
                {trendingProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="min-w-[160px] sm:min-w-[200px] md:min-w-[260px] snap-start"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fade-in 0.5s ease-out forwards'
                    }}
                  >
                    <ProductCard product={product} onSelect={setSelectedProduct} />
                  </div>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
          </AnimatedSection>
        )}

        {/* Product Grid */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-1 sm:h-10 sm:w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
                </p>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2 sm:space-y-3">
                  <Skeleton className="w-full aspect-[3/4] rounded-xl sm:rounded-2xl" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in 0.5s ease-out forwards'
                  }}
                >
                  <ProductCard product={product} onSelect={setSelectedProduct} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 lg:py-20 animate-fade-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl">🔍</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                Try adjusting your search or category filter
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                variant="outline"
                className="rounded-full px-6 sm:px-8 text-sm sm:text-base"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </AnimatedSection>
      </main>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </div>
  );
}
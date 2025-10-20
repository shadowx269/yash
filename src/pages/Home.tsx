import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Product, getProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/Footer';
import { FeaturedCategories } from '@/components/FeaturedCategories';
import { PromoBanner } from '@/components/PromoBanner';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AppSidebar } from '@/components/AppSidebar';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount-desc'>('relevance');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

      <div className="flex">
        <div className={`fixed left-0 top-[57px] bottom-0 z-30 overflow-y-auto transition-all duration-300 bg-card border-r ${isSidebarCollapsed ? 'w-16' : 'w-56 md:w-64 xl:w-72'}`}>
          <AppSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onClearFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
            productCount={filteredProducts.length}
            totalCount={products.length}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-56 md:ml-64 xl:ml-72'}`}>
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 lg:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
            <Breadcrumb />

            <AnimatedSection animation="scaleIn">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden">
                <HeroCarousel />
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <PromoBanner />
            </AnimatedSection>

            <AnimatedSection>
              <FeaturedCategories />
            </AnimatedSection>

            {trendingProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
              <AnimatedSection>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 lg:mb-6 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-6 w-1 sm:h-8 sm:w-1 lg:h-10 lg:w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Trending Now
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Most popular items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 self-start sm:self-auto">
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-semibold text-primary">Hot Picks</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex gap-2 sm:gap-2.5 lg:gap-3 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide snap-x snap-mandatory -mx-3 sm:-mx-4 px-3 sm:px-4">
                    {trendingProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="min-w-[110px] xs:min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px] snap-start"
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

            <AnimatedSection>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 lg:mb-6 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-6 w-1 sm:h-8 sm:w-1 lg:h-10 lg:w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-heading font-bold text-foreground">
                      {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-2.5 lg:gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="space-y-1 sm:space-y-2">
                      <Skeleton className="w-full aspect-[4/5] sm:aspect-[3/4] rounded-lg sm:rounded-xl" />
                      <Skeleton className="h-2 sm:h-3 w-3/4" />
                      <Skeleton className="h-2 sm:h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-2.5 lg:gap-3">
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
                <div className="text-center py-8 sm:py-12 lg:py-16 animate-fade-in">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl lg:text-3xl">🔍</span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-heading font-bold mb-1.5 sm:mb-2">No products found</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 px-4">
                    Try adjusting your filters
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setPriceRange([minPrice, maxPrice]);
                      setSortBy('relevance');
                    }}
                    variant="outline"
                    className="rounded-full px-4 sm:px-6 lg:px-8 h-9 sm:h-10 text-xs sm:text-sm"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </AnimatedSection>
          </div>
        </main>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Search, Package, TrendingUp, ShoppingBag, AlertCircle, Download, ArrowUpDown, ChevronUp, ChevronDown, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Product, getProducts, saveProducts, getCurrentUser, saveCurrentUser, CATEGORIES } from '@/lib/mockData';
import { toast } from 'sonner';
import { Footer } from '@/components/Footer';

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [sortField, setSortField] = useState<'name' | 'category' | 'discountPrice' | 'stock'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    setProducts(getProducts());
  }, [user, navigate]);

  // Debounce search for smoother typing
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  // Image upload helper functions
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const imagePromises = Array.from(files).map(file => {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select only image files');
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Image size should be less than 5MB');
        }
        return convertFileToBase64(file);
      });

      const base64Images = await Promise.all(imagePromises);
      setUploadedImages(prev => [...prev, ...base64Images]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addImageUrl = (url: string) => {
    if (url.trim()) {
      setUploadedImages(prev => [...prev, url.trim()]);
    }
  };

  const handleLogout = () => {
    saveCurrentUser(null);
    navigate('/');
  };

  const handleAddProduct = () => {
    setEditingProduct({
      id: `product-${Date.now()}`,
      name: '',
      category: 'Kurti',
      fabric: '',
      description: '',
      originalPrice: 0,
      discountPrice: 0,
      discountPercent: 0,
      stock: true,
      images: [],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#C2185B'],
    });
    setUploadedImages([]);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setUploadedImages([...product.images]);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const updated = products.filter((p) => p.id !== productToDelete);
    setProducts(updated);
    saveProducts(updated);
    toast.success('Product deleted successfully');
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    // Basic validation
    if (!editingProduct.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!editingProduct.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    if (editingProduct.originalPrice <= 0 || editingProduct.discountPrice <= 0) {
      toast.error('Prices must be greater than 0');
      return;
    }
    if (editingProduct.discountPrice > editingProduct.originalPrice) {
      toast.error('Discounted price cannot exceed original price');
      return;
    }
    if (uploadedImages.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    const discountPercent = Math.round(
      ((editingProduct.originalPrice - editingProduct.discountPrice) / editingProduct.originalPrice) * 100
    );

    const updatedProduct = { ...editingProduct, images: uploadedImages, discountPercent };
    const existingIndex = products.findIndex((p) => p.id === updatedProduct.id);

    let updated: Product[];
    if (existingIndex >= 0) {
      updated = [...products];
      updated[existingIndex] = updatedProduct;
      toast.success('Product updated successfully');
    } else {
      updated = [...products, updatedProduct];
      toast.success('Product added successfully');
    }

    setProducts(updated);
    saveProducts(updated);
    setIsDialogOpen(false);
    setEditingProduct(null);
    setUploadedImages([]);
  };

  // Filtering
  const filteredProducts = products.filter(product => {
    const q = debouncedQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q) || (product.fabric || '').toLowerCase().includes(q);
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesStock = stockFilter === 'all' || (stockFilter === 'in' ? product.stock : !product.stock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let res = 0;
    if (sortField === 'name') res = a.name.localeCompare(b.name);
    if (sortField === 'category') res = a.category.localeCompare(b.category);
    if (sortField === 'discountPrice') res = a.discountPrice - b.discountPrice;
    if (sortField === 'stock') res = Number(b.stock) - Number(a.stock);
    return sortDir === 'asc' ? res : -res;
  });

  // Pagination
  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filterCategory, stockFilter, sortField, sortDir, pageSize]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const exportCsv = () => {
    const headers = ['id', 'name', 'category', 'fabric', 'discountPrice', 'originalPrice', 'discountPercent', 'stock', 'trending'];
    const lines = [headers.join(',')].concat(
      sortedProducts.map(p => [
        p.id,
        JSON.stringify(p.name),
        JSON.stringify(p.category),
        JSON.stringify(p.fabric || ''),
        p.discountPrice,
        p.originalPrice,
        p.discountPercent,
        p.stock ? 'In Stock' : 'Out of Stock',
        p.trending ? 'Yes' : 'No'
      ].join(','))
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock).length,
    outOfStock: products.filter(p => !p.stock).length,
    trending: products.filter(p => p.trending).length,
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage your product inventory</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90 shadow-lg text-xs sm:text-sm h-8 sm:h-10">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Button>
              <Button variant="outline" onClick={exportCsv} className="hover:bg-primary/10 text-xs sm:text-sm h-8 sm:h-10">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs sm:text-sm h-8 sm:h-10">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{stats.total}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">In Stock</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{stats.inStock}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-destructive">{stats.outOfStock}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Trending</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">{stats.trending}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-4 sm:mb-6 shadow-lg">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full h-9 sm:h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as typeof stockFilter)}>
                  <SelectTrigger className="w-full h-9 sm:h-10">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in">In Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(parseInt(v, 10))}>
                  <SelectTrigger className="w-full h-9 sm:h-10">
                    <SelectValue placeholder="Page size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[8, 12, 16, 24].map(size => (
                      <SelectItem key={size} value={String(size)}>{size} / page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-heading">Products Inventory</CardTitle>
              <div className="text-sm text-muted-foreground">{totalItems} items</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Image</TableHead>
                    <TableHead className="font-semibold cursor-pointer select-none" onClick={() => toggleSort('name')}>
                      <div className="inline-flex items-center gap-1">Name {sortField !== 'name' ? <ArrowUpDown className="h-3 w-3" /> : (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}</div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer select-none" onClick={() => toggleSort('category')}>
                      <div className="inline-flex items-center gap-1">Category {sortField !== 'category' ? <ArrowUpDown className="h-3 w-3" /> : (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}</div>
                    </TableHead>
                    <TableHead className="font-semibold">Fabric</TableHead>
                    <TableHead className="font-semibold">Sizes</TableHead>
                    <TableHead className="font-semibold cursor-pointer select-none" onClick={() => toggleSort('discountPrice')}>
                      <div className="inline-flex items-center gap-1">Price {sortField !== 'discountPrice' ? <ArrowUpDown className="h-3 w-3" /> : (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}</div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer select-none" onClick={() => toggleSort('stock')}>
                      <div className="inline-flex items-center gap-1">Status {sortField !== 'stock' ? <ArrowUpDown className="h-3 w-3" /> : (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}</div>
                    </TableHead>
                    <TableHead className="font-semibold">Tags</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        No products found. Add your first product to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageItems.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{product.fabric || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {product.sizes && product.sizes.length > 0 ? (
                              product.sizes.slice(0, 3).map((size, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {size}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                            {product.sizes && product.sizes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.sizes.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-primary">₹{product.discountPrice}</span>
                            {product.discountPercent > 0 && (
                              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock ? "default" : "destructive"} className="shadow-sm">
                            {product.stock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.trending && (
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(product.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                Showing <span className="font-medium text-foreground">{totalItems === 0 ? 0 : startIndex + 1}-{endIndex}</span> of <span className="font-medium text-foreground">{totalItems}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Previous</Button>
                <div className="px-2">Page {safePage} of {totalPages}</div>
                <Button variant="outline" size="sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">
              {editingProduct?.name ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold">Category *</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                  >
                    <SelectTrigger className="focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter(c => c !== 'All').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fabric" className="text-sm font-semibold">Fabric</Label>
                <Input
                  id="fabric"
                  placeholder="e.g., Cotton, Silk, Polyester"
                  value={editingProduct.fabric || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                  className="focus-visible:ring-primary"
                />
              </div>

              {/* Sizes Management */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Available Sizes</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter size (e.g., S, M, L, XL, Free Size)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          const size = input.value.trim();
                          if (size && !editingProduct.sizes?.includes(size)) {
                            setEditingProduct({
                              ...editingProduct,
                              sizes: [...(editingProduct.sizes || []), size]
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const size = input.value.trim();
                        if (size && !editingProduct.sizes?.includes(size)) {
                          setEditingProduct({
                            ...editingProduct,
                            sizes: [...(editingProduct.sizes || []), size]
                          });
                          input.value = '';
                        }
                      }}
                    >
                      Add Size
                    </Button>
                  </div>

                  {/* Display current sizes */}
                  {editingProduct.sizes && editingProduct.sizes.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Current Sizes ({editingProduct.sizes.length})
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {editingProduct.sizes.map((size, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm"
                          >
                            <span>{size}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-primary/20"
                              onClick={() => {
                                setEditingProduct({
                                  ...editingProduct,
                                  sizes: editingProduct.sizes?.filter((_, i) => i !== index) || []
                                });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={4}
                  className="focus-visible:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="text-sm font-semibold">Original Price (₹) *</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="0.00"
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice" className="text-sm font-semibold">Discounted Price (₹) *</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    placeholder="0.00"
                    value={editingProduct.discountPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, discountPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="focus-visible:ring-primary"
                  />
                  {editingProduct.originalPrice > 0 && editingProduct.discountPrice > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Discount: {Math.round(((editingProduct.originalPrice - editingProduct.discountPrice) / editingProduct.originalPrice) * 100)}% off
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Product Images *</Label>
                <div className="space-y-4">
                  {/* Upload from files */}
                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className="text-sm text-muted-foreground">
                      Upload Images (JPG, PNG, WebP - Max 5MB each)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {isUploading && (
                        <div className="text-sm text-muted-foreground">Uploading...</div>
                      )}
                    </div>
                  </div>

                  {/* Add image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="image-url" className="text-sm text-muted-foreground">
                      Or add image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addImageUrl(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addImageUrl(input.value);
                          input.value = '';
                        }}
                      >
                        Add URL
                      </Button>
                    </div>
                  </div>

                  {/* Display uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Uploaded Images ({uploadedImages.length})
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="stock"
                    checked={editingProduct.stock}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, stock: checked })}
                  />
                  <Label htmlFor="stock" className="cursor-pointer font-semibold">In Stock</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="trending"
                    checked={editingProduct.trending || false}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, trending: checked })}
                  />
                  <Label htmlFor="trending" className="cursor-pointer font-semibold">Mark as Trending</Label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setUploadedImages([]);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-primary hover:bg-primary/90 shadow-lg"
                >
                  Save Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export interface Product {
  id: string;
  name: string;
  category: string;
  fabric?: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  stock: boolean;
  images: string[];
  trending?: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export const CATEGORIES = [
  'All',
  'Kurti',
  'Kurta Sets',
  'Sarees',
  'Ready to Wear Sarees',
  'Blouses',
  'Lehengas',
  'Palazzos',
  'Indo Western Dress',
  'Dupattas',
] as const;

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Rani Pink Kurti',
    category: 'Kurti',
    fabric: 'Cotton',
    description: 'Beautiful hand-embroidered kurti perfect for festive occasions. Features intricate threadwork and comfortable cotton fabric.',
    originalPrice: 2499,
    discountPrice: 1799,
    discountPercent: 28,
    stock: true,
    trending: true,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#C2185B', '#FF7043', '#FFD54F'],
  },
  {
    id: '2',
    name: 'Royal Blue Kurta Set',
    category: 'Kurta Sets',
    fabric: 'Silk Blend',
    description: 'Complete kurta set with palazzo and dupatta. Perfect for weddings and festive celebrations.',
    originalPrice: 3999,
    discountPrice: 2999,
    discountPercent: 25,
    stock: true,
    trending: true,
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800', 'https://images.unsplash.com/photo-1611916656173-875e4277bea6?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1565C0', '#C2185B', '#4A148C'],
  },
  {
    id: '3',
    name: 'Traditional Silk Saree',
    category: 'Sarees',
    fabric: 'Pure Silk',
    description: 'Luxurious silk saree with golden border. Timeless elegance for special occasions.',
    originalPrice: 8999,
    discountPrice: 6499,
    discountPercent: 28,
    stock: true,
    images: ['https://images.unsplash.com/photo-1610030469046-98bf6c561251?w=800', 'https://images.unsplash.com/photo-1583391265492-eb4a7b5d03f3?w=800'],
    sizes: ['Free Size'],
    colors: ['#D32F2F', '#C2185B', '#4A148C'],
  },
  {
    id: '4',
    name: 'Designer Lehenga Set',
    category: 'Lehengas',
    fabric: 'Georgette',
    description: 'Stunning lehenga choli with intricate embroidery and sequin work. Perfect for weddings.',
    originalPrice: 12999,
    discountPrice: 9999,
    discountPercent: 23,
    stock: true,
    trending: true,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'https://images.unsplash.com/photo-1610030469046-98bf6c561251?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#C2185B', '#FFD54F', '#1565C0'],
  },
  {
    id: '5',
    name: 'Cotton Palazzo Pants',
    category: 'Palazzos',
    fabric: 'Cotton',
    description: 'Comfortable cotton palazzo pants with elastic waist. Perfect for daily wear.',
    originalPrice: 899,
    discountPrice: 599,
    discountPercent: 33,
    stock: true,
    images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#212121', '#C2185B', '#1565C0'],
  },
  {
    id: '6',
    name: 'Ready to Wear Saree',
    category: 'Ready to Wear Sarees',
    fabric: 'Georgette',
    description: 'Pre-stitched saree for easy draping. Perfect for working women and quick occasions.',
    originalPrice: 3499,
    discountPrice: 2499,
    discountPercent: 29,
    stock: false,
    images: ['https://images.unsplash.com/photo-1583391265841-83afd6cbc10e?w=800'],
    sizes: ['Free Size'],
    colors: ['#C2185B', '#FF7043'],
  },
  {
    id: '7',
    name: 'Embroidered Dupatta',
    category: 'Dupattas',
    fabric: 'Chiffon',
    description: 'Lightweight chiffon dupatta with delicate embroidery. Pairs perfectly with any outfit.',
    originalPrice: 799,
    discountPrice: 499,
    discountPercent: 38,
    stock: true,
    images: ['https://images.unsplash.com/photo-1617519019082-2964fcdc29ad?w=800'],
    sizes: ['Free Size'],
    colors: ['#FFD54F', '#C2185B', '#FF7043'],
  },
  {
    id: '8',
    name: 'Indo Western Gown',
    category: 'Indo Western Dress',
    fabric: 'Net & Silk',
    description: 'Fusion wear gown combining traditional and modern elements. Perfect for parties.',
    originalPrice: 5999,
    discountPrice: 4499,
    discountPercent: 25,
    stock: true,
    trending: true,
    images: ['https://images.unsplash.com/photo-1583391265855-4768eadf3e80?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#C2185B', '#1565C0', '#4A148C'],
  },
];

export const heroImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200',
    title: 'Festive Picks',
    subtitle: 'Up to 30% Off',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200',
    title: 'New Arrivals',
    subtitle: 'Fresh Collection',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1610030469046-98bf6c561251?w=1200',
    title: 'Shop the Look',
    subtitle: 'Trending Now',
  },
];

// LocalStorage utilities
const STORAGE_KEYS = {
  PRODUCTS: 'priya_products',
  WISHLIST: 'priya_wishlist',
  USER: 'priya_user',
  USERS: 'priya_users',
};

export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      { id: 'admin-1', email: 'admin@priyascollection.com', password: 'admin123', role: 'admin' },
      { id: 'user-1', email: 'user@example.com', password: 'user123', role: 'user' },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
};

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return stored ? JSON.parse(stored) : mockProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getWishlist = (userId: string): string[] => {
  const stored = localStorage.getItem(`${STORAGE_KEYS.WISHLIST}_${userId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveWishlist = (userId: string, productIds: string[]) => {
  localStorage.setItem(`${STORAGE_KEYS.WISHLIST}_${userId}`, JSON.stringify(productIds));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
};

export const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  return user ? { id: user.id, email: user.email, role: user.role } : null;
};

export const registerUser = (email: string, password: string): User => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    role: 'user' as const,
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return { id: newUser.id, email: newUser.email, role: newUser.role };
};

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  description?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const products: Product[] = [
  // Spirits
  { id: 1, name: "Don Julio 1942", price: 35000, category: "spirits", stock: 5, image: "https://images.unsplash.com/photo-1516535750141-6e2f85446f11?auto=format&fit=crop&q=80&w=800", isFeatured: true },
  { id: 2, name: "Hennessy XO", price: 42000, category: "spirits", stock: 3, image: "https://images.unsplash.com/photo-1592701010181-15529130176d?auto=format&fit=crop&q=80&w=800", isBestSeller: true },
  
  // Whiskey
  { id: 3, name: "Macallan 18 Year", price: 75000, category: "whiskey", stock: 2, image: "https://images.unsplash.com/photo-1569158062925-993d08596642?auto=format&fit=crop&q=80&w=800", isBestSeller: true },
  { id: 4, name: "Glenfiddich 15 Year", price: 12500, category: "whiskey", stock: 12, image: "https://images.unsplash.com/photo-1527281400828-ac737a999b1a?auto=format&fit=crop&q=80&w=800" },
  
  // Wines
  { id: 5, name: "Château Margaux 2015", price: 180000, category: "wines", stock: 1, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800", isFeatured: true },
  { id: 6, name: "Whispering Angel Rosé", price: 5500, category: "wines", stock: 24, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800", isNew: true },
  
  // Vodka
  { id: 7, name: "Grey Goose VX", price: 15000, category: "vodka", stock: 8, image: "https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=800" },
  { id: 8, name: "Belvedere Heritage 176", price: 8500, category: "vodka", stock: 15, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800", isNew: true },
  
  // Beer
  { id: 9, name: "Guinness Foreign Extra (6-Pack)", price: 1200, category: "beer", stock: 50, image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800" },
  { id: 10, name: "Heineken Silver (Case)", price: 4800, category: "beer", stock: 20, image: "https://images.unsplash.com/photo-1597075095400-01d6706e2577?auto=format&fit=crop&q=80&w=800", isBestSeller: true },
  
  // Rum
  { id: 11, name: "Diplomático Reserva", price: 9500, category: "rum", stock: 6, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" },
  { id: 12, name: "Ron Zacapa 23", price: 11000, category: "rum", stock: 4, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" },
  
  // Cocktails
  { id: 13, name: "Negroni Premix (500ml)", price: 4500, category: "cocktails", stock: 10, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800", isNew: true },
  { id: 14, name: "Espresso Martini Kit", price: 6500, category: "cocktails", stock: 5, image: "https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=800" },
  
  // Non-Alcoholic
  { id: 15, name: "Seedlip Garden 108", price: 5800, category: "non-alcoholic", stock: 12, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800" },
  { id: 16, name: "Lyre's Italian Orange", price: 4200, category: "non-alcoholic", stock: 18, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800", isNew: true },
  
  // Additional Premium Items
  { id: 17, name: "Louis XIII Cognac", price: 650000, category: "spirits", stock: 1, image: "https://images.unsplash.com/photo-1592701010181-15529130176d?auto=format&fit=crop&q=80&w=800", isFeatured: true },
  { id: 18, name: "Yamazaki 25 Year", price: 1200000, category: "whiskey", stock: 1, image: "https://images.unsplash.com/photo-1569158062925-993d08596642?auto=format&fit=crop&q=80&w=800", isFeatured: true },
  { id: 19, name: "Dom Pérignon Luminous", price: 85000, category: "wines", stock: 4, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800", isBestSeller: true },
  { id: 20, name: "Patrón El Alto", price: 38000, category: "spirits", stock: 6, image: "https://images.unsplash.com/photo-1516535750141-6e2f85446f11?auto=format&fit=crop&q=80&w=800", isNew: true },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price);
};

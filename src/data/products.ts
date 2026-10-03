export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const categories = [
  { id: 'all', name: 'All Items', emoji: '🏪' },
  { id: 'drinks', name: 'Drinks', emoji: '☕' },
  { id: 'food', name: 'Food', emoji: '🍔' },
  { id: 'snacks', name: 'Snacks', emoji: '🍿' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  { id: 'extras', name: 'Extras', emoji: '✨' },
];

export const products: Product[] = [
  // Drinks
  { id: 'd1', name: 'Espresso', price: 2.50, category: 'drinks', emoji: '☕', color: 'from-amber-800 to-amber-900' },
  { id: 'd2', name: 'Latte', price: 4.00, category: 'drinks', emoji: '🥛', color: 'from-amber-100 to-amber-200' },
  { id: 'd3', name: 'Cappuccino', price: 3.80, category: 'drinks', emoji: '☕', color: 'from-orange-200 to-orange-300' },
  { id: 'd4', name: 'Green Tea', price: 2.80, category: 'drinks', emoji: '🍵', color: 'from-green-200 to-green-300' },
  { id: 'd5', name: 'Fresh Juice', price: 4.50, category: 'drinks', emoji: '🧃', color: 'from-orange-300 to-orange-400' },
  { id: 'd6', name: 'Smoothie', price: 5.00, category: 'drinks', emoji: '🥤', color: 'from-pink-200 to-pink-300' },
  { id: 'd7', name: 'Hot Chocolate', price: 3.50, category: 'drinks', emoji: '🍫', color: 'from-yellow-800 to-yellow-900' },
  { id: 'd8', name: 'Iced Coffee', price: 4.20, category: 'drinks', emoji: '🧊', color: 'from-blue-200 to-blue-300' },

  // Food
  { id: 'f1', name: 'Classic Burger', price: 8.50, category: 'food', emoji: '🍔', color: 'from-yellow-400 to-yellow-500' },
  { id: 'f2', name: 'Chicken Wrap', price: 7.00, category: 'food', emoji: '🌯', color: 'from-green-300 to-green-400' },
  { id: 'f3', name: 'Caesar Salad', price: 6.50, category: 'food', emoji: '🥗', color: 'from-green-400 to-green-500' },
  { id: 'f4', name: 'Margherita Pizza', price: 9.00, category: 'food', emoji: '🍕', color: 'from-red-300 to-red-400' },
  { id: 'f5', name: 'Pasta Bowl', price: 8.00, category: 'food', emoji: '🍝', color: 'from-yellow-300 to-yellow-400' },
  { id: 'f6', name: 'Club Sandwich', price: 7.50, category: 'food', emoji: '🥪', color: 'from-amber-300 to-amber-400' },
  { id: 'f7', name: 'Fish & Chips', price: 9.50, category: 'food', emoji: '🐟', color: 'from-blue-300 to-blue-400' },
  { id: 'f8', name: 'Veggie Bowl', price: 7.00, category: 'food', emoji: '🥬', color: 'from-emerald-300 to-emerald-400' },

  // Snacks
  { id: 's1', name: 'French Fries', price: 3.50, category: 'snacks', emoji: '🍟', color: 'from-yellow-300 to-yellow-400' },
  { id: 's2', name: 'Nachos', price: 4.50, category: 'snacks', emoji: '🌮', color: 'from-orange-300 to-orange-400' },
  { id: 's3', name: 'Onion Rings', price: 3.80, category: 'snacks', emoji: '🧅', color: 'from-amber-300 to-amber-400' },
  { id: 's4', name: 'Mozzarella Sticks', price: 4.00, category: 'snacks', emoji: '🧀', color: 'from-yellow-200 to-yellow-300' },
  { id: 's5', name: 'Chicken Nuggets', price: 4.50, category: 'snacks', emoji: '🍗', color: 'from-orange-200 to-orange-300' },
  { id: 's6', name: 'Garlic Bread', price: 3.00, category: 'snacks', emoji: '🍞', color: 'from-amber-200 to-amber-300' },

  // Desserts
  { id: 'ds1', name: 'Chocolate Cake', price: 5.50, category: 'desserts', emoji: '🍫', color: 'from-amber-800 to-amber-900' },
  { id: 'ds2', name: 'Cheesecake', price: 5.00, category: 'desserts', emoji: '🍰', color: 'from-yellow-100 to-yellow-200' },
  { id: 'ds3', name: 'Ice Cream', price: 3.50, category: 'desserts', emoji: '🍨', color: 'from-pink-100 to-pink-200' },
  { id: 'ds4', name: 'Apple Pie', price: 4.50, category: 'desserts', emoji: '🥧', color: 'from-red-200 to-red-300' },
  { id: 'ds5', name: 'Brownie', price: 3.80, category: 'desserts', emoji: '🟫', color: 'from-amber-700 to-amber-800' },
  { id: 'ds6', name: 'Tiramisu', price: 5.50, category: 'desserts', emoji: '🍮', color: 'from-amber-200 to-amber-300' },

  // Extras
  { id: 'e1', name: 'Extra Cheese', price: 1.00, category: 'extras', emoji: '🧀', color: 'from-yellow-200 to-yellow-300' },
  { id: 'e2', name: 'Avocado', price: 1.50, category: 'extras', emoji: '🥑', color: 'from-green-400 to-green-500' },
  { id: 'e3', name: 'Bacon', price: 2.00, category: 'extras', emoji: '🥓', color: 'from-red-300 to-red-400' },
  { id: 'e4', name: 'Extra Sauce', price: 0.50, category: 'extras', emoji: '🫙', color: 'from-red-200 to-red-300' },
  { id: 'e5', name: 'Gift Bag', price: 0.80, category: 'extras', emoji: '🛍️', color: 'from-purple-200 to-purple-300' },
  { id: 'e6', name: 'Candle', price: 1.00, category: 'extras', emoji: '🕯️', color: 'from-yellow-100 to-yellow-200' },
];

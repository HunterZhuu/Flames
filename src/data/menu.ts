export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  color: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'All', emoji: '🔥' },
  { id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'sandwiches', name: 'Sandwiches', emoji: '🥪' },
  { id: 'sliders', name: 'Sliders', emoji: '🍔' },
  { id: 'appetizers', name: 'Appetizers', emoji: '🍤' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝' },
  { id: 'mishkak', name: 'Mishkak', emoji: '🍢' },
  { id: 'salads', name: 'Salads', emoji: '🥗' },
  { id: 'fries', name: 'French Fries', emoji: '🍟' },
  { id: 'gathering', name: 'Gathering Box', emoji: '📦' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
  { id: 'extras', name: 'Extras', emoji: '✨' },
];

export const menuItems: MenuItem[] = [
  // Burgers
  { id: 'b1', name: 'Steak Bom Burger', description: 'Grilled steak with fresh bbq, lettuce, toasted onion rings and american cheese', price: 1.900, category: 'burgers', emoji: '🍔', color: 'from-orange-400 to-red-500', available: true },
  { id: 'b2', name: 'Signature Beef Burger', description: 'Fresh beef burger with cheese slice, beetroot sauce, fresh tomato slice and lettuce', price: 2.100, category: 'burgers', emoji: '🍔', color: 'from-red-400 to-red-600', available: true },
  { id: 'b3', name: 'Grilled Chicken Burger', description: 'Grilled chicken with fresh lettuce, cheese slice, dynamite sauce and tomato', price: 1.900, category: 'burgers', emoji: '🍗', color: 'from-yellow-400 to-orange-500', available: true },
  { id: 'b4', name: 'Crunchy Chicken Burger', description: 'Crispy chicken, cheese slice with tomato, fresh lettuce, jalapeno slices and classic sauce', price: 2.100, category: 'burgers', emoji: '🍔', color: 'from-amber-400 to-amber-600', available: true },
  { id: 'b5', name: 'Smoked Burger', description: 'Bacon, american lettuce, jalapeno, cheese slice and beetroot sauce', price: 2.100, category: 'burgers', emoji: '🔥', color: 'from-gray-600 to-gray-800', available: true },
  { id: 'b6', name: 'Crunchy Cheetos Burger', description: 'Crispy chicken patty, Cheetos, cheese, lettuce, tomato, and signature sauce', price: 2.100, category: 'burgers', emoji: '🧀', color: 'from-orange-500 to-red-500', available: true },
  { id: 'b7', name: 'Classic Burger', description: 'Grilled beef patty served with traditional toppings', price: 2.100, category: 'burgers', emoji: '🍔', color: 'from-yellow-500 to-yellow-700', available: true },
  { id: 'b8', name: 'Smoke House Burger', description: 'BBQ beef', price: 2.100, category: 'burgers', emoji: '🏠', color: 'from-red-600 to-red-800', available: true },
  { id: 'b9', name: 'Smash Burger', description: 'Ground beef, salt, black pepper, American cheese, bun', price: 1.900, category: 'burgers', emoji: '💥', color: 'from-amber-500 to-amber-700', available: true },
  { id: 'b10', name: 'Pomme Rocca Burger', description: 'Beef patty with fresh rocca, crispy potato sticks, cheese, tomato, and signature sauce', price: 2.100, category: 'burgers', emoji: '🥬', color: 'from-green-400 to-green-600', available: true },

  // Sandwiches
  { id: 'sw1', name: 'Philly Steak Sandwich', description: 'Sandwich with thinly sliced beef and cheese', price: 1.950, category: 'sandwiches', emoji: '🥪', color: 'from-amber-300 to-amber-500', available: true },

  // Sliders
  { id: 'sl1', name: 'Signature Beef Slider', description: 'Fresh beef burger with cheese slice, beetroot sauce, fresh tomato slice and lettuce', price: 1.300, category: 'sliders', emoji: '🍔', color: 'from-red-300 to-red-500', available: true },
  { id: 'sl2', name: 'Grilled Chicken Slider', description: 'Grilled chicken with fresh lettuce, cheese slice, dynamite sauce and tomato', price: 1.300, category: 'sliders', emoji: '🍗', color: 'from-yellow-300 to-yellow-500', available: true },
  { id: 'sl3', name: 'Crunchy Chicken Slider', description: 'Crispy chicken, cheese slice with tomato, fresh lettuce, jalapeno slices and classic sauce', price: 1.300, category: 'sliders', emoji: '🍔', color: 'from-orange-300 to-orange-500', available: true },

  // Appetizers
  { id: 'a1', name: 'Jolly Shrimp', description: 'Breaded crispy fried shrimp, glazed in our Jolly sauce with sesame seed and spring onion', price: 2.500, category: 'appetizers', emoji: '🍤', color: 'from-pink-400 to-pink-600', available: true },
  { id: 'a2', name: 'Dynamite Shrimp', description: 'Crispy golden-fried shrimp coated in a spicy mayo sauce', price: 2.700, category: 'appetizers', emoji: '🍤', color: 'from-red-400 to-orange-500', available: true },
  { id: 'a3', name: 'Flaming Shrimp', description: 'Crispy shrimp with special flaming sauce', price: 2.200, category: 'appetizers', emoji: '🔥', color: 'from-orange-500 to-red-600', available: true },
  { id: 'a4', name: 'Chicken Honey Pops', description: 'Chicken pops with special honey sauce', price: 1.880, category: 'appetizers', emoji: '🍯', color: 'from-yellow-300 to-amber-500', available: true },

  // Pasta
  { id: 'p1', name: 'Flames Mac And Cheese', description: 'Mac and cheese with special white sauce topped with red Cheetos', price: 2.100, category: 'pasta', emoji: '🧀', color: 'from-yellow-300 to-yellow-500', available: true },
  { id: 'p2', name: 'Flames Pinky Pasta', description: 'Pasta, chicken, tomatoes, cream pink sauce, butter, garlic, onion', price: 2.200, category: 'pasta', emoji: '🍝', color: 'from-pink-300 to-pink-500', available: true },
  { id: 'p3', name: 'Alfredo Pasta', description: 'Creamy pasta dish made with Alfredo sauce', price: 2.200, category: 'pasta', emoji: '🍝', color: 'from-amber-100 to-amber-300', available: true },
  { id: 'p4', name: 'Doro Chicken Pasta', description: 'Chicken penne pasta with pomodoro sauce, grilled chicken, mushrooms, capsicum, mozzarella and parmesan', price: 1.900, category: 'pasta', emoji: '🍝', color: 'from-red-300 to-red-400', available: true },

  // Mishkak
  { id: 'm1', name: 'Chicken Mishkak', description: '3 skewers of chicken + sauce', price: 1.200, category: 'mishkak', emoji: '🍢', color: 'from-amber-400 to-amber-600', available: true },
  { id: 'm2', name: 'Beef Mishkak', description: '3 skewers of beef with sauce', price: 1.200, category: 'mishkak', emoji: '🍢', color: 'from-red-400 to-red-600', available: true },

  // Salads
  { id: 'sa1', name: 'Caesar Salad', description: 'Crisp romaine lettuce, croutons, parmesan cheese, and Caesar dressing', price: 1.800, category: 'salads', emoji: '🥗', color: 'from-green-300 to-green-500', available: true },
  { id: 'sa2', name: 'Rocca Salad', description: 'Fresh arugula, parmesan cheese, and other toppings', price: 2.200, category: 'salads', emoji: '🥗', color: 'from-emerald-300 to-emerald-500', available: true },

  // French Fries
  { id: 'f1', name: 'Flames Original Fries', description: 'French fries topped with flames sauce, jalapeño, melted cheese, and fresh onions', price: 0.900, category: 'fries', emoji: '🍟', color: 'from-yellow-300 to-yellow-500', available: true },
  { id: 'f2', name: 'Flames Cheese Fries', description: 'French fries topped with melted cheese, Flames sauce, jalapeño, and fresh onions', price: 1.100, category: 'fries', emoji: '🧀', color: 'from-yellow-400 to-orange-400', available: true },
  { id: 'f3', name: 'Dynamite Chicken Fries', description: 'Chicken with french fries, jalapeño, melted cheese and flames sauce', price: 2.700, category: 'fries', emoji: '🍟', color: 'from-red-300 to-red-500', available: true },
  { id: 'f4', name: 'Dynamite Beef Fries', description: 'Beef with french fries, jalapeño, melted cheese and flames sauce', price: 2.700, category: 'fries', emoji: '🍟', color: 'from-red-400 to-red-600', available: true },
  { id: 'f5', name: 'Crispy Chicken Dynamite Fries', description: 'Crispy Chicken with french fries, jalapeño, melted cheese and flames sauce', price: 2.700, category: 'fries', emoji: '🍟', color: 'from-orange-400 to-red-400', available: true },

  // Gathering Box
  { id: 'g1', name: 'Slider Box', description: '4 Slider burger with fries added to the American cheese', price: 3.500, category: 'gathering', emoji: '📦', color: 'from-purple-400 to-purple-600', available: true },
  { id: 'g2', name: 'Duetto Box', description: '2 burger, French fries, beetroot sauce', price: 3.500, category: 'gathering', emoji: '📦', color: 'from-indigo-400 to-indigo-600', available: true },

  // Drinks
  { id: 'dr1', name: 'Kinza Orange', description: 'Water, sugar, orange juice, citric acid, orange flavor', price: 0.400, category: 'drinks', emoji: '🍊', color: 'from-orange-300 to-orange-500', available: true },
  { id: 'dr2', name: 'Kinza Cola', description: 'Carbonated soft drink', price: 0.400, category: 'drinks', emoji: '🥤', color: 'from-gray-600 to-gray-800', available: true },
  { id: 'dr3', name: 'Kinza Lemon', description: 'Carbonated lemon-lime flavored soft drink', price: 0.400, category: 'drinks', emoji: '🍋', color: 'from-yellow-200 to-yellow-400', available: true },
  { id: 'dr4', name: 'Small Water', description: 'Stay hydrated and refreshed', price: 0.200, category: 'drinks', emoji: '💧', color: 'from-blue-200 to-blue-400', available: true },
  { id: 'dr5', name: 'Orange Juice', description: 'Natural sweetness and tangy citrus flavor, packed with Vitamin C', price: 1.500, category: 'drinks', emoji: '🍊', color: 'from-orange-400 to-orange-600', available: true },
  { id: 'dr6', name: 'Blueberry Mojito', description: 'Blueberry, blackberry, lemon and mint', price: 1.500, category: 'drinks', emoji: '🫐', color: 'from-blue-400 to-purple-500', available: true },
  { id: 'dr7', name: 'Passion Mojito', description: 'Passion fruit, mint and lime', price: 1.400, category: 'drinks', emoji: '🍹', color: 'from-yellow-300 to-pink-400', available: true },
  { id: 'dr8', name: 'Lucy Mojito', description: 'Refreshing drink made with lime, mint, and soda water', price: 1.400, category: 'drinks', emoji: '🍃', color: 'from-green-300 to-green-500', available: true },
  { id: 'dr9', name: 'Mojito', description: 'Strawberry, mint, lemon and 7up', price: 1.400, category: 'drinks', emoji: '🍓', color: 'from-red-300 to-pink-400', available: true },

  // Extras
  { id: 'e1', name: 'Extra Beef Bacon', description: 'Crispy bacon with your special burger', price: 0.500, category: 'extras', emoji: '🥓', color: 'from-red-300 to-red-500', available: true },
  { id: 'e2', name: 'Extra Patty', description: 'Add an extra piece of meat', price: 0.700, category: 'extras', emoji: '🥩', color: 'from-red-400 to-red-600', available: true },
  { id: 'e3', name: 'Extra Classic Sauce', description: 'Side serving of classic sauce', price: 0.400, category: 'extras', emoji: '🫙', color: 'from-amber-300 to-amber-500', available: true },
  { id: 'e4', name: 'Extra Chicken Skewer', description: 'A skewer of grilled chicken pieces', price: 0.400, category: 'extras', emoji: '🍢', color: 'from-amber-400 to-amber-600', available: true },
  { id: 'e5', name: 'Extra Beef Mishkak Skewer', description: 'Marinated grilled beef skewer', price: 0.400, category: 'extras', emoji: '🍢', color: 'from-red-300 to-red-500', available: true },
];

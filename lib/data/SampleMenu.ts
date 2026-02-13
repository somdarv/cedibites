// ============================================
// CediBites Sample Menu Data
// Structure: KFC-style bundled meals with size variants
// Categories: Main Dishes | Combos | Starters & Sides | Appetizers | Desserts | Drinks
// ============================================

export interface MenuItemSize {
    key: 'small' | 'medium' | 'large';
    label: string;
    price: number;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    category: 'Main Dishes' | 'Combos' | 'Starters & Sides' | 'Appetizers' | 'Desserts' | 'Drinks';
    sizes: MenuItemSize[];
    icon: string;
    image?: string;
    url: string;
    popular?: boolean;
    isNew?: boolean;
}

export const sampleMenuItems: MenuItem[] = [

    // ============================================
    // MAIN DISHES
    // ============================================
    {
        id: '1',
        name: 'Jollof Pro Max',
        description: 'Smoky party jollof rice with grilled chicken, coleslaw & fried plantain',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 45 },
            { key: 'medium', label: 'Medium', price: 65 },
            { key: 'large', label: 'Large', price: 85 },
        ],
        icon: '🍚',
        image: '/images/menu/1.webp',
        url: '/menu?item=jollof-pro-max',
        popular: true,
    },
    {
        id: '2',
        name: 'Banku & Tilapia',
        description: 'Fermented banku with whole fried tilapia & garden eggs pepper',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 55 },
            { key: 'medium', label: 'Medium', price: 75 },
            { key: 'large', label: 'Large', price: 95 },
        ],
        icon: '🐟',
        image: '/images/menu/2.webp',
        url: '/menu?item=banku-tilapia',
        popular: true,
    },
    {
        id: '3',
        name: 'Waakye Gala',
        description: 'Rice & beans with beef sausage, spaghetti, fried fish & shito',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 40 },
            { key: 'medium', label: 'Medium', price: 58 },
            { key: 'large', label: 'Large', price: 75 },
        ],
        icon: '🍛',
        image: '/images/menu/3.webp',
        url: '/menu?item=waakye-gala',
        popular: true,
    },
    {
        id: '4',
        name: 'Fufu & Light Soup',
        description: 'Pounded fufu with goat meat light soup & garden eggs',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 50 },
            { key: 'medium', label: 'Medium', price: 70 },
            { key: 'large', label: 'Large', price: 90 },
        ],
        icon: '🍲',
        image: '/images/menu/4.webp',
        url: '/menu?item=fufu-light-soup',
    },
    {
        id: '5',
        name: 'Red Red Box',
        description: 'Black-eyed peas stew with fried plantain & fried fish',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 35 },
            { key: 'medium', label: 'Medium', price: 50 },
            { key: 'large', label: 'Large', price: 65 },
        ],
        icon: '🫘',
        image: '/images/menu/5.webp',
        url: '/menu?item=red-red-box',
    },
    {
        id: '6',
        name: 'Kenkey & Grilled Fish',
        description: 'Fante kenkey with grilled tilapia, pepper sauce & onion salad',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 45 },
            { key: 'medium', label: 'Medium', price: 62 },
            { key: 'large', label: 'Large', price: 80 },
        ],
        icon: '🌽',
        image: '/images/menu/6.webp',
        url: '/menu?item=kenkey-grilled-fish',
    },
    {
        id: '7',
        name: 'Fried Rice Special',
        description: 'Mixed vegetable fried rice with grilled chicken & spring rolls',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 40 },
            { key: 'medium', label: 'Medium', price: 58 },
            { key: 'large', label: 'Large', price: 75 },
        ],
        icon: '🍚',
        image: '/images/menu/7.webp',
        url: '/menu?item=fried-rice-special',
    },
    {
        id: '8',
        name: 'Tuo Zaafi',
        description: 'TZ with ayoyo soup, smoked fish & dried okra',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 40 },
            { key: 'medium', label: 'Medium', price: 55 },
            { key: 'large', label: 'Large', price: 70 },
        ],
        icon: '🥣',
        image: '/images/menu/8.webp',
        url: '/menu?item=tuo-zaafi',
        isNew: true,
    },
    {
        id: '9',
        name: 'Kontomire Stew Plate',
        description: 'Cocoyam leaves stew with boiled yam, egg & fried plantain',
        category: 'Main Dishes',
        sizes: [
            { key: 'small', label: 'Small', price: 38 },
            { key: 'medium', label: 'Medium', price: 52 },
            { key: 'large', label: 'Large', price: 68 },
        ],
        icon: '🥬',
        url: '/menu?item=kontomire-stew',
    },

    // ============================================
    // COMBOS
    // ============================================
    {
        id: '10',
        name: 'CediBites Classic Combo',
        description: 'Jollof rice + grilled chicken + kelewele + sobolo',
        category: 'Combos',
        sizes: [
            { key: 'small', label: 'Solo', price: 75 },
            { key: 'medium', label: 'Duo', price: 130 },
            { key: 'large', label: 'Family', price: 240 },
        ],
        icon: '🍱',
        image: '/images/menu/9.webp',
        url: '/menu?item=cedibites-classic-combo',
        popular: true,
    },
    {
        id: '11',
        name: 'The Waakye Pack',
        description: 'Waakye + sausage + fried fish + egg + sobolo',
        category: 'Combos',
        sizes: [
            { key: 'small', label: 'Solo', price: 70 },
            { key: 'medium', label: 'Duo', price: 120 },
            { key: 'large', label: 'Family', price: 220 },
        ],
        icon: '🥡',
        url: '/menu?item=waakye-pack',
        popular: true,
    },
    {
        id: '12',
        name: 'Fish Lover Combo',
        description: 'Banku + tilapia + kenkey + pepper sauce + asaana',
        category: 'Combos',
        sizes: [
            { key: 'small', label: 'Solo', price: 80 },
            { key: 'medium', label: 'Duo', price: 145 },
            { key: 'large', label: 'Family', price: 265 },
        ],
        icon: '🐠',
        url: '/menu?item=fish-lover-combo',
    },
    {
        id: '13',
        name: 'Office Lunch Box',
        description: 'Fried rice + grilled chicken + plantain + drink of choice',
        category: 'Combos',
        sizes: [
            { key: 'small', label: 'Solo', price: 72 },
            { key: 'medium', label: 'Duo', price: 128 },
            { key: 'large', label: 'Family', price: 230 },
        ],
        icon: '💼',
        url: '/menu?item=office-lunch-box',
        isNew: true,
    },
    {
        id: '14',
        name: 'Weekend Special',
        description: 'Fufu + goat light soup + oxtail + garden eggs + cold sobolo',
        category: 'Combos',
        sizes: [
            { key: 'small', label: 'Solo', price: 95 },
            { key: 'medium', label: 'Duo', price: 170 },
            { key: 'large', label: 'Family', price: 310 },
        ],
        icon: '🎉',
        url: '/menu?item=weekend-special',
    },

    // ============================================
    // STARTERS & SIDES
    // ============================================
    {
        id: '15',
        name: 'Kelewele',
        description: 'Spicy fried plantains seasoned with ginger & pepper',
        category: 'Starters & Sides',
        sizes: [
            { key: 'small', label: 'Small', price: 20 },
            { key: 'medium', label: 'Medium', price: 32 },
            { key: 'large', label: 'Large', price: 45 },
        ],
        icon: '🍠',
        url: '/menu?item=kelewele',
        popular: true,
    },
    {
        id: '16',
        name: 'Fried Plantain',
        description: 'Sweet ripe plantains, golden fried to perfection',
        category: 'Starters & Sides',
        sizes: [
            { key: 'small', label: 'Small', price: 18 },
            { key: 'medium', label: 'Medium', price: 28 },
            { key: 'large', label: 'Large', price: 40 },
        ],
        icon: '🍌',
        url: '/menu?item=fried-plantain',
    },
    {
        id: '17',
        name: 'Coleslaw',
        description: 'Creamy shredded cabbage with carrots & sweet dressing',
        category: 'Starters & Sides',
        sizes: [
            { key: 'small', label: 'Small', price: 15 },
            { key: 'medium', label: 'Medium', price: 22 },
            { key: 'large', label: 'Large', price: 32 },
        ],
        icon: '🥗',
        url: '/menu?item=coleslaw',
    },
    {
        id: '18',
        name: 'Shito Rice',
        description: 'Steamed rice drizzled with homemade black pepper shito',
        category: 'Starters & Sides',
        sizes: [
            { key: 'small', label: 'Small', price: 22 },
            { key: 'medium', label: 'Medium', price: 35 },
            { key: 'large', label: 'Large', price: 48 },
        ],
        icon: '🍙',
        url: '/menu?item=shito-rice',
    },
    {
        id: '19',
        name: 'Garden Egg Salad',
        description: 'Roasted garden eggs with onions, tomatoes & fish',
        category: 'Starters & Sides',
        sizes: [
            { key: 'small', label: 'Small', price: 18 },
            { key: 'medium', label: 'Medium', price: 28 },
            { key: 'large', label: 'Large', price: 40 },
        ],
        icon: '🍆',
        url: '/menu?item=garden-egg-salad',
    },

    // ============================================
    // APPETIZERS
    // ============================================
    {
        id: '20',
        name: 'Chin Chin Bites',
        description: 'Crispy fried dough bites lightly sweetened',
        category: 'Appetizers',
        sizes: [
            { key: 'small', label: 'Small', price: 15 },
            { key: 'medium', label: 'Medium', price: 25 },
            { key: 'large', label: 'Large', price: 38 },
        ],
        icon: '🍘',
        url: '/menu?item=chin-chin-bites',
        popular: true,
    },
    {
        id: '21',
        name: 'Meat Pie',
        description: 'Flaky pastry filled with spiced minced beef & vegetables',
        category: 'Appetizers',
        sizes: [
            { key: 'small', label: '1 piece', price: 18 },
            { key: 'medium', label: '3 pieces', price: 48 },
            { key: 'large', label: '6 pieces', price: 90 },
        ],
        icon: '🥧',
        url: '/menu?item=meat-pie',
        popular: true,
    },
    {
        id: '22',
        name: 'Spring Rolls',
        description: 'Crispy rolls stuffed with seasoned chicken & vegetables',
        category: 'Appetizers',
        sizes: [
            { key: 'small', label: '2 pieces', price: 22 },
            { key: 'medium', label: '4 pieces', price: 40 },
            { key: 'large', label: '8 pieces', price: 75 },
        ],
        icon: '🥢',
        url: '/menu?item=spring-rolls',
    },
    {
        id: '23',
        name: 'Bofrot',
        description: 'Ghanaian puff puff — soft, fluffy fried dough balls',
        category: 'Appetizers',
        sizes: [
            { key: 'small', label: '3 pieces', price: 12 },
            { key: 'medium', label: '6 pieces', price: 22 },
            { key: 'large', label: '12 pieces', price: 40 },
        ],
        icon: '🧆',
        url: '/menu?item=bofrot',
        isNew: true,
    },
    {
        id: '24',
        name: 'Fried Yam Fries',
        description: 'Golden fried yam sticks served with pepper sauce',
        category: 'Appetizers',
        sizes: [
            { key: 'small', label: 'Small', price: 20 },
            { key: 'medium', label: 'Medium', price: 32 },
            { key: 'large', label: 'Large', price: 48 },
        ],
        icon: '🍟',
        url: '/menu?item=fried-yam-fries',
    },

    // ============================================
    // DESSERTS
    // ============================================
    {
        id: '25',
        name: 'Pineapple Fritters',
        description: 'Battered fresh pineapple rings, fried golden with cinnamon sugar',
        category: 'Desserts',
        sizes: [
            { key: 'small', label: '2 pieces', price: 18 },
            { key: 'medium', label: '4 pieces', price: 32 },
            { key: 'large', label: '6 pieces', price: 45 },
        ],
        icon: '🍍',
        url: '/menu?item=pineapple-fritters',
        popular: true,
    },
    {
        id: '26',
        name: 'Coconut Ice Cream',
        description: 'Homemade coconut ice cream with toasted coconut flakes',
        category: 'Desserts',
        sizes: [
            { key: 'small', label: '1 scoop', price: 22 },
            { key: 'medium', label: '2 scoops', price: 38 },
            { key: 'large', label: '3 scoops', price: 52 },
        ],
        icon: '🍦',
        url: '/menu?item=coconut-ice-cream',
    },
    {
        id: '27',
        name: 'Banana Cake',
        description: 'Moist banana loaf cake with caramel drizzle',
        category: 'Desserts',
        sizes: [
            { key: 'small', label: '1 slice', price: 20 },
            { key: 'medium', label: '2 slices', price: 35 },
            { key: 'large', label: '4 slices', price: 65 },
        ],
        icon: '🍰',
        url: '/menu?item=banana-cake',
        isNew: true,
    },
    {
        id: '28',
        name: 'Ofam',
        description: 'Traditional Ghanaian sweet fried plantain cake',
        category: 'Desserts',
        sizes: [
            { key: 'small', label: 'Small', price: 18 },
            { key: 'medium', label: 'Medium', price: 28 },
            { key: 'large', label: 'Large', price: 42 },
        ],
        icon: '🫓',
        url: '/menu?item=ofam',
    },

    // ============================================
    // DRINKS
    // ============================================
    {
        id: '29',
        name: 'Sobolo',
        description: 'Chilled hibiscus flower drink with ginger & cloves',
        category: 'Drinks',
        sizes: [
            { key: 'small', label: '350ml', price: 15 },
            { key: 'medium', label: '500ml', price: 22 },
            { key: 'large', label: '1L', price: 38 },
        ],
        icon: '🥤',
        image: '/images/menu/9.webp',
        url: '/menu?item=sobolo',
        popular: true,
    },
    {
        id: '30',
        name: 'Asaana',
        description: 'Fermented roasted corn drink — sweet, tangy & refreshing',
        category: 'Drinks',
        sizes: [
            { key: 'small', label: '350ml', price: 15 },
            { key: 'medium', label: '500ml', price: 22 },
            { key: 'large', label: '1L', price: 38 },
        ],
        icon: '🍶',
        url: '/menu?item=asaana',
    },
    {
        id: '31',
        name: 'Bissap Juice',
        description: 'Fresh hibiscus & baobab blend with a citrus twist',
        category: 'Drinks',
        sizes: [
            { key: 'small', label: '350ml', price: 18 },
            { key: 'medium', label: '500ml', price: 25 },
            { key: 'large', label: '1L', price: 42 },
        ],
        icon: '🍹',
        url: '/menu?item=bissap-juice',
        isNew: true,
    },
    {
        id: '32',
        name: 'Pineapple Ginger Juice',
        description: 'Freshly blended pineapple with Ghanaian ginger & lime',
        category: 'Drinks',
        sizes: [
            { key: 'small', label: '350ml', price: 20 },
            { key: 'medium', label: '500ml', price: 28 },
            { key: 'large', label: '1L', price: 45 },
        ],
        icon: '🍍',
        url: '/menu?item=pineapple-ginger-juice',
        popular: true,
    },
    {
        id: '33',
        name: 'Malt Drink',
        description: 'Chilled Malta Guinness or Alvaro — your choice',
        category: 'Drinks',
        sizes: [
            { key: 'small', label: '330ml', price: 12 },
            { key: 'medium', label: '500ml', price: 18 },
            { key: 'large', label: '2-Pack', price: 30 },
        ],
        icon: '🍺',
        url: '/menu?item=malt-drink',
    },
    {
        id: '34',
        name: 'Bottled Water',
        description: 'Pure chilled still water',
        category: 'Drinks',
        sizes: [
            { key: 'small', label: '500ml', price: 7 },
            { key: 'medium', label: '1L', price: 12 },
            { key: 'large', label: '1.5L', price: 18 },
        ],
        icon: '💧',
        url: '/menu?item=bottled-water',
    },
];

// ============================================
// CATEGORY CONFIG — matches nav pill order
// ============================================
export const menuCategories = [
    { id: 'all', label: 'Most Popular' },
    { id: 'Main Dishes', label: 'Main Dishes' },
    { id: 'Combos', label: 'Combos' },
    { id: 'Starters & Sides', label: 'Starters & Sides' },
    { id: 'Appetizers', label: 'Appetizers' },
    { id: 'Desserts', label: 'Desserts' },
    { id: 'Drinks', label: 'Drinks' },
];
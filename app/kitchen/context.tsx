'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { KitchenOrder, KitchenOrderStatus, KitchenStats } from './types';
import { useKitchenSounds } from './hooks/useSounds';

const KITCHEN_CHANNEL = 'cedibites-kitchen';
const KITCHEN_STORAGE_KEY = 'cedibites-kitchen-orders';

function loadOrders(): KitchenOrder[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(KITCHEN_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveOrders(orders: KitchenOrder[]) {
  try {
    localStorage.setItem(KITCHEN_STORAGE_KEY, JSON.stringify(orders));
  } catch { /* ignore */ }
}

// Mock orders for development - replace with WebSocket data
const MOCK_ORDERS: KitchenOrder[] = [
  {
    id: 'ko-001',
    orderNumber: 'CB1234',
    items: [
      { id: '1', name: 'Jollof Rice', quantity: 2 },
      { id: '2', name: 'Fried Chicken', quantity: 2 },
      { id: '3', name: 'Coleslaw', quantity: 1 },
    ],
    status: 'received',
    orderType: 'dine_in',
    customerName: 'Kwame',
    source: 'pos',
    createdAt: Date.now() - 3 * 60 * 1000,
  },
  {
    id: 'ko-002',
    orderNumber: 'CB1235',
    items: [
      { id: '4', name: 'Waakye', quantity: 1 },
      { id: '5', name: 'Kelewele', quantity: 1 },
      { id: '6', name: 'Malta Guinness', quantity: 2 },
    ],
    status: 'received',
    orderType: 'takeaway',
    notes: 'Extra spicy please',
    source: 'pos',
    createdAt: Date.now() - 5 * 60 * 1000,
  },
  {
    id: 'ko-003',
    orderNumber: 'CB1236',
    items: [
      { id: '7', name: 'Banku & Tilapia', quantity: 1 },
      { id: '8', name: 'Pepper Sauce (Extra)', quantity: 1 },
    ],
    status: 'accepted',
    orderType: 'delivery',
    customerName: 'Ama',
    source: 'online',
    createdAt: Date.now() - 6 * 60 * 1000,
    acceptedAt: Date.now() - 4 * 60 * 1000,
  },
  {
    id: 'ko-006',
    orderNumber: 'CB1239',
    items: [
      { id: '13', name: 'Red Red & Plantain', quantity: 2 },
      { id: '14', name: 'Sobolo', quantity: 2 },
    ],
    status: 'preparing',
    orderType: 'dine_in',
    customerName: 'Yaw',
    source: 'pos',
    createdAt: Date.now() - 10 * 60 * 1000,
    acceptedAt: Date.now() - 7 * 60 * 1000,
    startedAt: Date.now() - 5 * 60 * 1000,
  },
  {
    id: 'ko-004',
    orderNumber: 'CB1237',
    items: [
      { id: '9', name: 'Fried Rice', quantity: 3 },
      { id: '10', name: 'Grilled Chicken', quantity: 3 },
      { id: '11', name: 'Coca Cola', quantity: 3 },
    ],
    status: 'preparing',
    orderType: 'dine_in',
    notes: 'Table 5 - Family order',
    source: 'pos',
    createdAt: Date.now() - 12 * 60 * 1000,
    startedAt: Date.now() - 6 * 60 * 1000,
  },
  {
    id: 'ko-005',
    orderNumber: 'CB1238',
    items: [
      { id: '12', name: 'Fufu & Light Soup', quantity: 2 },
    ],
    status: 'ready',
    orderType: 'pickup',
    customerName: 'Kofi Asante',
    source: 'phone',
    createdAt: Date.now() - 15 * 60 * 1000,
    startedAt: Date.now() - 10 * 60 * 1000,
    readyAt: Date.now() - 2 * 60 * 1000,
  },
];

interface KitchenContextValue {
  orders: KitchenOrder[];
  ordersByStatus: {
    received: KitchenOrder[];
    accepted: KitchenOrder[];
    preparing: KitchenOrder[];
    ready: KitchenOrder[];
  };
  stats: KitchenStats;
  acceptOrder: (orderId: string) => void;
  startOrder: (orderId: string) => void;
  markReady: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  completeAllReady: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  simulateNewOrder: () => void;
}

const KitchenContext = createContext<KitchenContextValue | null>(null);

export function useKitchen() {
  const ctx = useContext(KitchenContext);
  if (!ctx) throw new Error('useKitchen must be used within KitchenProvider');
  return ctx;
}

export function KitchenProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<KitchenOrder[]>(() => loadOrders() || MOCK_ORDERS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sounds = useKitchenSounds();
  const prevOrderCountRef = useRef(orders.length);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isExternalUpdate = useRef(false);

  // Set up BroadcastChannel for cross-tab sync
  useEffect(() => {
    const channel = new BroadcastChannel(KITCHEN_CHANNEL);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const incomingOrders = event.data as KitchenOrder[];
      isExternalUpdate.current = true;
      setOrders(incomingOrders);
    };

    return () => channel.close();
  }, []);

  // Persist & broadcast whenever orders change (skip if it came from another tab)
  useEffect(() => {
    saveOrders(orders);
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }
    channelRef.current?.postMessage(orders);
  }, [orders]);

  // Sync sound enabled state
  useEffect(() => {
    sounds.setEnabled(soundEnabled);
  }, [soundEnabled, sounds]);

  // Play sound when new order arrives
  useEffect(() => {
    if (orders.length > prevOrderCountRef.current) {
      sounds.playNewOrder();
    }
    prevOrderCountRef.current = orders.length;
  }, [orders.length, sounds]);

  // Group and sort orders by status
  const ordersByStatus = useMemo(() => {
    const grouped = {
      received: [] as KitchenOrder[],
      accepted: [] as KitchenOrder[],
      preparing: [] as KitchenOrder[],
      ready: [] as KitchenOrder[],
    };

    const sorted = [...orders].sort((a, b) => a.createdAt - b.createdAt);

    sorted.forEach(order => {
      if (order.status in grouped) {
        grouped[order.status].push(order);
      }
    });

    return grouped;
  }, [orders]);

  // Stats
  const stats = useMemo((): KitchenStats => {
    const completedOrders = orders.filter(o => o.readyAt && o.startedAt);
    const avgPrepTime = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => sum + (o.readyAt! - o.startedAt!), 0) / completedOrders.length / 1000
      : 0;

    return {
      received: ordersByStatus.received.length,
      accepted: ordersByStatus.accepted.length,
      preparing: ordersByStatus.preparing.length,
      ready: ordersByStatus.ready.length,
      avgPrepTime: Math.round(avgPrepTime),
    };
  }, [orders, ordersByStatus]);

  const acceptOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && order.status === 'received') {
        sounds.playTap();
        return { ...order, status: 'accepted' as KitchenOrderStatus, acceptedAt: Date.now() };
      }
      return order;
    }));
  }, [sounds]);

  const startOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && order.status === 'accepted') {
        sounds.playOrderStarted();
        return { ...order, status: 'preparing' as KitchenOrderStatus, startedAt: Date.now() };
      }
      return order;
    }));
  }, [sounds]);

  const markReady = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && order.status === 'preparing') {
        sounds.playOrderReady();
        return { ...order, status: 'ready' as KitchenOrderStatus, readyAt: Date.now() };
      }
      return order;
    }));
  }, [sounds]);

  const completeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    sounds.playTap();
  }, [sounds]);

  const completeAllReady = useCallback(() => {
    setOrders(prev => prev.filter(order => order.status !== 'ready'));
    sounds.playTap();
  }, [sounds]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const simulateNewOrder = useCallback(() => {
    const mockItems = [
      { id: '1', name: 'Jollof Rice', quantity: Math.ceil(Math.random() * 3) },
      { id: '2', name: 'Fried Chicken', quantity: Math.ceil(Math.random() * 2) },
      { id: '3', name: 'Waakye', quantity: 1 },
      { id: '4', name: 'Banku & Tilapia', quantity: 1 },
    ];

    const orderTypes: KitchenOrder['orderType'][] = ['dine_in', 'takeaway', 'delivery', 'pickup'];
    const sources: KitchenOrder['source'][] = ['pos', 'online', 'phone', 'whatsapp'];
    const names = ['Kwame', 'Ama', 'Kofi', 'Akua', 'Yaw', 'Abena'];

    const newOrder: KitchenOrder = {
      id: `ko-${Date.now()}`,
      orderNumber: `CB${Math.floor(1000 + Math.random() * 9000)}`,
      items: mockItems.slice(0, Math.ceil(Math.random() * 3) + 1),
      status: 'received',
      orderType: orderTypes[Math.floor(Math.random() * orderTypes.length)],
      customerName: names[Math.floor(Math.random() * names.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      createdAt: Date.now(),
    };

    setOrders(prev => [newOrder, ...prev]);
  }, []);

  return (
    <KitchenContext.Provider value={{
      orders, ordersByStatus, stats,
      acceptOrder, startOrder, markReady, completeOrder, completeAllReady,
      soundEnabled, setSoundEnabled,
      isFullscreen, toggleFullscreen,
      simulateNewOrder,
    }}>
      {children}
    </KitchenContext.Provider>
  );
}

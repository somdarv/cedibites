// Kitchen Display Types

export type KitchenOrderStatus = 'received' | 'accepted' | 'preparing' | 'ready';

export interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  items: KitchenOrderItem[];
  status: KitchenOrderStatus;
  orderType: 'dine_in' | 'takeaway' | 'delivery' | 'pickup';
  customerName?: string;
  notes?: string;
  source: 'pos' | 'online' | 'phone' | 'whatsapp';
  createdAt: number; // timestamp
  acceptedAt?: number; // when accepted by chef
  startedAt?: number; // when moved to preparing
  readyAt?: number; // when marked ready
}

export interface KitchenStats {
  received: number;
  accepted: number;
  preparing: number;
  ready: number;
  avgPrepTime: number; // in seconds
}

export const STATUS_CONFIG: Record<KitchenOrderStatus, {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
}> = {
  received: {
    label: 'New',
    bgColor: 'bg-brown/10',
    textColor: 'text-brown',
    dotColor: 'bg-brown',
  },
  accepted: {
    label: 'Accepted',
    bgColor: 'bg-teal-600/10',
    textColor: 'text-teal-600',
    dotColor: 'bg-teal-600',
  },
  preparing: {
    label: 'Cooking',
    bgColor: 'bg-warning/15',
    textColor: 'text-warning',
    dotColor: 'bg-warning',
  },
  ready: {
    label: 'Ready',
    bgColor: 'bg-secondary/15',
    textColor: 'text-secondary',
    dotColor: 'bg-secondary',
  },
};

'use client';

// app/orders/[id]/page.tsx
// SMS tracking links land here → boots the unified orders page with the order pre-selected

import { useParams } from 'next/navigation';
import OrdersPage from '@/app/orders/page';

export default function OrderByIdPage() {
    const params = useParams();
    const id = (params?.id as string ?? '').toUpperCase();
    return <OrdersPage preselectedId={id} />;
}
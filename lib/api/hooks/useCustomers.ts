import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import type { CustomersParams } from '../services/customer.service';

export const useCustomers = (params?: CustomersParams) => {
  const {
    data: customersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getCustomers(params),
    staleTime: 2 * 60 * 1000,
  });

  return {
    customers: customersData?.data || [],
    meta: customersData?.meta,
    links: customersData?.links,
    isLoading,
    error,
    refetch,
  };
};

export const useCustomerOrders = (customerId: string | null, params?: { status?: string; page?: number }) => {
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['customer-orders', customerId, params],
    queryFn: () => customerService.getCustomerOrders(Number(customerId!), params),
    enabled: !!customerId,
    staleTime: 60 * 1000,
  });

  return {
    orders: ordersData?.data || [],
    meta: ordersData?.meta,
    links: ordersData?.links,
    isLoading,
    error,
    refetch,
  };
};

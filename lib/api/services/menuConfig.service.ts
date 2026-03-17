import apiClient from '@/lib/api/client';
import type { MenuConfig } from '@/lib/hooks/useMenuConfig';

function extractData<T>(response: unknown): T {
  const r = response as { data?: T };
  return (r?.data ?? response) as T;
}

export const menuConfigService = {
  async get(): Promise<MenuConfig> {
    const response = await apiClient.get('/menu-config');
    return extractData<MenuConfig>(response);
  },

  async save(config: MenuConfig): Promise<MenuConfig> {
    const response = await apiClient.put('/menu-config', { config });
    return extractData<MenuConfig>(response);
  },
};

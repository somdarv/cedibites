import type { MenuItem as ApiMenuItem, MenuItemSize as ApiMenuItemSize } from '@/types/api';

/**
 * Display format for menu items - compatible with SampleMenu shape.
 * Uses id (string) for display/React keys; numericId for API calls (promo resolve, cart, orders).
 */
export interface DisplayMenuItem {
  id: string;
  numericId: number;
  name: string;
  description: string;
  category: string;
  price?: number;
  sizes?: { id: number; key: string; label: string; price: number; image?: string }[];
  hasVariants?: boolean;
  availableAddOns?: string[];
  variants?: { plain?: number; assorted?: number };
  image?: string;
  url: string;
  popular?: boolean;
  isNew?: boolean;
}

export interface DisplayMenuCategory {
  id: string;
  name: string;
}

function toNum(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const n = parseFloat(String(v ?? 0));
  return Number.isNaN(n) ? 0 : n;
}

function mapApiSizeToDisplay(size: ApiMenuItemSize): { id: number; key: string; label: string; price: number; image?: string } {
  return {
    id: size.id,
    key: size.size_key,
    label: size.size_label,
    price: toNum(size.price),
  };
}

/**
 * Map API MenuItem to display format for POS, new-order, staff store, etc.
 */
export function apiMenuItemToDisplayItem(api: ApiMenuItem): DisplayMenuItem {
  const categoryName = api.category?.name ?? 'Uncategorized';
  const slug = api.slug ?? String(api.id);
  const sizes = api.sizes?.length
    ? api.sizes.map(mapApiSizeToDisplay)
    : undefined;

  const hasSizes = sizes !== undefined && sizes.length > 0;
  const hasVariants = api.has_variants ?? hasSizes;
  const variants = api.variant_type === 'plain_assorted' && api.sizes?.length === 2
    ? { plain: toNum(api.sizes[0]?.price), assorted: toNum(api.sizes[1]?.price) }
    : undefined;

  return {
    id: String(api.id),
    numericId: api.id,
    name: api.name,
    description: api.description ?? '',
    category: categoryName,
    price: hasSizes ? undefined : toNum(api.base_price),
    sizes,
    hasVariants,
    variants,
    image: api.image_url,
    url: `/menu?item=${slug}`,
    popular: api.is_popular ?? false,
    isNew: api.is_new ?? false,
  };
}

/**
 * Derive unique categories from display items.
 */
export function deriveCategories(items: DisplayMenuItem[]): DisplayMenuCategory[] {
  const seen = new Set<string>();
  const categories: DisplayMenuCategory[] = [];
  for (const item of items) {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      categories.push({ id: item.category.toLowerCase().replace(/\s+/g, '-'), name: item.category });
    }
  }
  return categories;
}

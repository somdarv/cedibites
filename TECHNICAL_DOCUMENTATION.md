# CediBites — Technical Documentation

> Last updated: February 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Provider / State Architecture](#4-provider--state-architecture)
5. [Pages](#5-pages)
6. [Components](#6-components)
7. [Data Layer](#7-data-layer)
8. [Utilities](#8-utilities)
9. [Types](#9-types)
10. [Authentication Flow](#10-authentication-flow)
11. [Cart & Branch Switching Logic](#11-cart--branch-switching-logic)
12. [Checkout Flow](#12-checkout-flow)
13. [Order Tracking Flow](#13-order-tracking-flow)
14. [Google Maps Integration](#14-google-maps-integration)
15. [Known Stubs & TODOs](#15-known-stubs--todos)

---

## 1. Project Overview

CediBites is a **multi-branch Ghanaian restaurant ordering web app** built with Next.js. Customers can:

- Browse the full menu (with search, category filtering, and sort)
- Add items to a persistent cart
- Switch between restaurant branches (with automatic cart validation)
- Checkout with delivery or pickup, paying via Mobile Money or cash
- Track their order in real time using a code
- Sign in via phone number + SMS OTP to save their profile

The app is a **client-side SPA** embedded inside the Next.js App Router. All data (menu, branches, orders) is currently served from static TypeScript files — ready to be swapped for real API calls.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Icons | @phosphor-icons/react v2 |
| Fonts | Cabin & Caprasimo (Google Fonts), ABeeZee (local) |
| Maps | Google Maps JS API + Nominatim (OpenStreetMap) fallback |
| Linting | ESLint 9 with eslint-config-next |
| Package Manager | npm |

### Key Environment Variables

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY   — Required for Maps JS API and Places Autocomplete
```

---

## 3. Project Structure

```
cedibites/
├── app/
│   ├── layout.tsx                    # Root layout — provider tree + fonts
│   ├── page.tsx                      # Home page (/)
│   ├── globals.css                   # Global styles + Tailwind
│   ├── menu/
│   │   └── page.tsx                  # Full menu page (/menu)
│   ├── checkout/
│   │   └── page.tsx                  # Checkout page (/checkout)
│   ├── orders/
│   │   ├── page.tsx                  # Order tracking search (/orders)
│   │   └── [orderCode]/
│   │       └── page.tsx              # Live order tracking (/orders/[code])
│   ├── order-history/
│   │   └── page.tsx                  # Order history (/order-history)
│   ├── menuaudit/
│   │   └── page.tsx                  # Internal branch menu visualizer
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx
│       │   └── Footer.tsx
│       ├── base/
│       │   ├── Button.tsx
│       │   └── Loader.tsx
│       ├── ui/
│       │   ├── AuthModal.tsx
│       │   ├── BranchSelectorModal.tsx
│       │   ├── CartDrawer.tsx
│       │   ├── DynamicGreeting.tsx
│       │   ├── ItemDetailModal.tsx
│       │   ├── LocationBadge.tsx
│       │   ├── LocationRequestModal.tsx
│       │   ├── MenuGrid.tsx
│       │   ├── MenuItemCard.tsx
│       │   ├── PromoBanner.tsx
│       │   ├── Stepdone.tsx
│       │   └── UniversalSearch.tsx
│       ├── sections/
│       │   └── HeroSearch.tsx
│       ├── order/
│       │   ├── LiveMap.tsx
│       │   ├── OrderDetails.tsx
│       │   └── OrderTimeline.tsx
│       └── providers/
│           ├── AuthProvider.tsx
│           ├── BranchProvider.tsx
│           ├── CartProvider.tsx
│           ├── LocationProvider.tsx
│           ├── MenuDiscoveryProvider.tsx
│           └── ModalProvider.tsx
├── lib/
│   ├── data/
│   │   ├── SampleMenu.ts             # Menu items, categories, add-ons
│   │   └── HeroSearchCategoryItems.ts # Category pill labels for hero
│   └── utils/
│       └── distance.ts               # Haversine distance + delivery time
├── types/
│   ├── order.ts                      # Order types, mock data, timeline builders
│   ├── branch.ts
│   ├── components.ts
│   └── index.ts
├── fonts/
│   ├── ABeeZee-Regular.ttf
│   └── ABeeZee-Italic.ttf
├── public/
│   └── images/
│       ├── cblogo.webp
│       └── menu/                     # Item images (1.webp … 15.webp)
├── next.config.ts
├── tsconfig.json
├── tailwind.config (via postcss.config.mjs)
└── package.json
```

---

## 4. Provider / State Architecture

The app uses React Context for all global state. Providers are nested in `app/layout.tsx` in this order (outermost first):

```
ModalProvider
  AuthProvider
    LocationProvider (autoRequest=false)
      BranchProvider
        MenuDiscoveryProvider (items=sampleMenuItems)
          CartProvider
            <page content>
              LocationRequestModal  (global)
              BranchSelectorModal   (global)
```

Each provider exposes a custom hook for consuming its context.

---

### 4.1 ModalProvider

**File:** `app/components/providers/ModalProvider.tsx`

Centralised controller for all modal/drawer open states. Prevents multiple overlays from being open simultaneously.

| State | Hook method | Notes |
|---|---|---|
| `isCartOpen` | `openCart / closeCart` | Cart drawer |
| `isBranchSelectorOpen` | `openBranchSelector / closeBranchSelector` | Global branch modal |
| `isLocationModalOpen` | `openLocationModal / closeLocationModal` | Location permission modal |
| `isAuthOpen` | `openAuth / closeAuth` | Auth modal — closes all other overlays when opened |

Also manages a **single scroll lock** via `document.body.style.overflow = 'hidden'` whenever any overlay is open.

---

### 4.2 AuthProvider

**File:** `app/components/providers/AuthProvider.tsx`

Handles phone + OTP authentication with localStorage session persistence.

**Auth steps:** `idle` → `phone` → `otp` → `naming` → `done`

**Key API:**

| Method | Description |
|---|---|
| `sendOTP(phone)` | Generates a 6-digit OTP; logs to console in dev; production stub for Africa's Talking / Hubtel SMS |
| `verifyOTP(code)` | Compares against in-memory OTP; routes to `naming` for new users, `done` for returning users |
| `saveProfile(name, phone)` | Persists `AuthUser` to `localStorage` under key `cedibites-auth-user` |
| `saveFromCheckout(name, phone)` | Quick-save after successful order (no OTP needed — trust from checkout) |
| `logout()` | Clears user from state and localStorage |

**Storage key:** `cedibites-auth-user`
**Dev helper:** `devOTP` state is exposed — the `AuthModal` renders it visibly in development mode with an "Auto-fill" button.

---

### 4.3 LocationProvider

**File:** `app/components/providers/LocationProvider.tsx`

Wraps the browser `navigator.geolocation` API.

- On mount: reads a previously stored location from `localStorage` key `user-location`
- `autoRequest` prop (passed as `false` from root layout) controls whether to prompt immediately on mount
- Cached location has no built-in TTL enforcement (stored with a `timestamp` field for future use)
- Permission state: `loading | prompt | granted | denied`
- `requestLocation()` calls `getCurrentPosition` with `enableHighAccuracy: true`, 10s timeout, 5-min cache

---

### 4.4 BranchProvider

**File:** `app/components/providers/BranchProvider.tsx`

Manages the selected branch and all branch-related computations.

**Branch data** is defined inline as `BRANCHES: Branch[]` (exported). 7 branches in Accra:

| ID | Name | Type | Status |
|---|---|---|---|
| 1 | Osu | Flagship (full menu) | Open |
| 2 | East Legon | Flagship | Open |
| 3 | Spintex | Smaller (limited menu) | **Closed** |
| 4 | Tema | Flagship (full menu) | Open |
| 5 | Madina | Traditional focus | Open |
| 6 | La Paz | Medium | Open |
| 7 | Dzorwulu | Flagship (full menu) | Open |

Each branch has a `menuItemIds: string[]` representing which menu item IDs it carries. Flagship branches carry `ALL_ITEMS` (IDs 1–34 — legacy numbering from previous menu schema).

**Key methods:**

| Method | Description |
|---|---|
| `getBranchesWithDistance(lat, lon)` | Returns all branches sorted by distance, with `distance`, `deliveryTime`, `isWithinRadius` attached |
| `findNearestBranch(lat, lon)` | Returns nearest open branch within radius, or nearest open branch if none within radius |
| `selectNearestBranchNow()` | Imperatively selects the nearest branch based on current coordinates |
| `validateCartForBranch` | (delegated to CartProvider) — splits cart into available/unavailable for a given branch |
| `isItemAvailableAtBranch(itemId, branchId)` | Single item availability check |

**Auto-selection:** When `coordinates` change by more than 0.5 km, the nearest branch is re-computed and auto-selected if it differs from the current selection.

**Persistence:** Selected branch ID is stored in `localStorage` under key `selected-branch-id`.

---

### 4.5 MenuDiscoveryProvider

**File:** `app/components/providers/MenuDiscoveryProvider.tsx`

Provides synchronous menu filtering for search and category selection.

- Accepts `items: SearchableItem[]` as a prop (passed `sampleMenuItems` from the root layout)
- `filteredItems` is a `useMemo` that applies both category filter and text search
- Searching clears the active category
- `selectedCategory === 'Most Popular'` filters `item.popular === true`
- `recentSearches` (max 8) are persisted to `localStorage` key `cedibites-recent-searches`

---

### 4.6 CartProvider

**File:** `app/components/providers/CartProvider.tsx`

Shopping cart with localStorage hydration.

**Cart item ID:** Composite key `${itemId}__${sizeKey}` — allows the same item in different sizes to be separate cart entries.

**Key API:**

| Method | Description |
|---|---|
| `addToCart(item, sizeKey)` | Adds item or increments quantity if already present |
| `removeFromCart(cartItemId)` | Removes entry entirely |
| `updateQuantity(cartItemId, qty)` | Sets qty; removes if qty ≤ 0 |
| `clearCart()` | Empties cart and removes from localStorage |
| `removeUnavailableItems(ids[])` | Batch removal used during branch switching |
| `validateCartForBranch(branchMenuItemIds)` | Returns `{ available, unavailable }` split |
| `isInCart(itemId, sizeKey)` | Boolean check |
| `getCartItem(itemId, sizeKey)` | Returns full CartItem or undefined |

**Derived values:** `totalItems` (sum of quantities), `subtotal` (sum of price × quantity).
**Storage key:** `cedibites-cart`

---

## 5. Pages

### 5.1 Home Page — `/`

**File:** `app/page.tsx`

Renders:
- `Navbar`
- `HeroSearch` — greeting card + promo banner + search + category pills
- `MenuGrid` — default "CediBites Mix" or filtered results
- `Footer`

### 5.2 Full Menu Page — `/menu`

**File:** `app/menu/page.tsx`

Features:
- **Sticky top bar** with search input, branch pill, sort dropdown, grid/list toggle, and mobile filter toggle
- **Desktop sidebar** with category list and branch info card (open/closed status, operating hours, "Change branch" link)
- **Mobile category strip** (shown via toggle) — horizontal scroll
- **Sort options:** Featured, Most Popular, Price Low→High, Price High→Low
- **View modes:** Grid (default) and List
- **Grouped grid:** When "All" selected with no search, items are grouped by category with section headers
- **Back-to-top button:** Appears after scrolling 600px

Sub-components (defined locally):
- `SortDropdown` — click-outside-aware dropdown
- `BranchPill` — shows selected branch name and distance, opens branch selector
- `EmptyState` — no-results message
- `ListItemRow` — single item in list view
- `SidebarCategoryBtn` — sidebar category button with count
- `GroupedGrid` — groups cards by category
- `BranchInfoCard` — sidebar branch status card

### 5.3 Checkout Page — `/checkout`

**File:** `app/checkout/page.tsx`

Three-step checkout flow:

| Step | Component | Description |
|---|---|---|
| 1 | `StepDetails` | Order type (delivery/pickup), branch selection, name, phone, delivery address |
| 2 | `StepPayment` | Payment method selection (MoMo, cash on delivery, cash at pickup), MoMo phone + network |
| 3 | `StepDone` | Order confirmed screen with order number, ETA, and "Save info" prompt |

**Guard:** If cart is empty and not on step 3, renders `EmptyCartGuard`.

**Order number generation:** `CB${Date.now().toString().slice(-6)}` — a 8-character code like `CB847291`.

**Inline `BranchSelectorSheet`:** A self-contained bottom sheet / centred modal for changing branches during checkout (separate from the global `BranchSelectorModal`). Handles cart conflict resolution inline.

**`AddressSearchField`:** Delivery address input with:
- Google Places Autocomplete (if `window.google.maps.places` is available)
- Nominatim (OpenStreetMap) fallback for address search
- "Use my current location" reverse-geocoding via Nominatim
- 300ms debounce on input

**Post-order save prompt:** On step 3, if the user is not logged in, a card offers to save their name/phone to localStorage for future fast checkout.

### 5.4 Order Tracking Search — `/orders`

**File:** `app/orders/page.tsx`

Simple search page accepting an 8-character order code matching pattern `CB\d{6}`. Validates format before navigating to `/orders/[orderCode]`. Includes:
- "Try example: CB847291" helper link
- "How to find your order code" guidance card
- "Track every step" status explainer
- Support phone number

### 5.5 Live Order Tracking — `/orders/[orderCode]`

**File:** `app/orders/[orderCode]/page.tsx`

Dynamic route. On mount, fetches mock order via `getMockOrder(orderCode)`. Layout:

**Left column (2/3 width on desktop):**
- Live status banner (when `out_for_delivery`)
- `LiveMap` — Google Maps with branch, customer, and rider markers (delivery orders only)
- `OrderDetails` — collapsible order items + pricing breakdown

**Right column (1/3 width):**
- `OrderTimeline` — step-by-step order status
- Delivery address card
- Contact card (call branch; call rider when out for delivery)
- Branch info card

**Share button:** Uses `navigator.share` Web Share API if available.

**Back navigation:** Reads `?from=order-history` query param to decide whether to navigate to `/order-history` or `/orders` on back press.

**WebSocket stub:** A commented-out WebSocket block shows where real-time updates would be wired in production.

### 5.6 Order History — `/order-history`

**File:** `app/order-history/page.tsx`

- Loads orders from `getMockOrdersForUser()` (mock, same data for all users)
- Guest notice with "Sign in" prompt (uses `openAuth()`)
- Search by order number, item name, or branch name
- Each order card links to `/orders/[orderCode]?from=order-history`
- "Reorder" button on completed/delivered orders (navigates to `/` — actual re-add to cart is a TODO)

### 5.7 Menu Audit — `/menuaudit`

**File:** `app/menuaudit/page.tsx`

Internal developer/admin tool for visualising menu coverage across branches. **Not linked from the public UI.**

Features:
- Branch tabs with item count
- Stats row: available items, unavailable items, coverage %, open/closed status
- Coverage progress bar
- **Cards view:** Item cards with availability badge, category filter, "show unavailable only" toggle
- **Matrix view:** Cross-tab of all items vs all branches with ✓/· availability cells

---

## 6. Components

### 6.1 Navbar

**File:** `app/components/layout/Navbar.tsx`

Fixed top navbar. Two visual rows (brown accent bar + dark main bar).

**Desktop:** Logo + nav links (Home, Our Menu, Track Order) + cart button + user avatar/button.

**Mobile:** Logo + cart button + hamburger → slide-in right drawer containing account section, nav links, current branch, and quick actions (view cart).

Active link detection uses exact path match + `matchPrefixes` for the orders section.

User avatar shows initials when logged in; dropdown menu provides "My Orders" and "Sign Out". Guest shows a user icon that opens the auth modal.

Renders `<CartDrawer />` and `<AuthModal />` (these are mounted here so they're always present in the DOM).

### 6.2 Footer

**File:** `app/components/layout/Footer.tsx`

Four-column desktop grid (hidden on mobile), containing:
- Brand + social links (Instagram, Facebook, WhatsApp — placeholder `#` hrefs)
- Opening hours
- Branch list (Osu, East Legon, Spintex, Madina, Tema)
- Contact details + quick links

Copyright and "Built by Saharabasetech" credit in bottom bar.

### 6.3 CartDrawer

**File:** `app/components/ui/CartDrawer.tsx`

Right-side slide-in panel on desktop, bottom sheet on mobile (`max-h-[92dvh]`).

Three internal views controlled by local `DrawerView` state:

| View | Content |
|---|---|
| `cart` | Cart items, branch pill (shows ordering branch), subtotal/delivery/tax/total, checkout CTA |
| `branch-select` | Branch list sorted by distance |
| `branch-conflict` | Warning + unavailable/available item split + 3 action buttons |

**Branch conflict resolution:**
1. User selects a new branch
2. `validateCartForBranch` splits cart items
3. If conflicts exist → show conflict view
4. Options: "Remove X items & Switch" / "Keep current branch" / "Pick a different branch"

Closes on Escape key or backdrop click.

### 6.4 MenuItemCard

**File:** `app/components/ui/MenuItemCard.tsx`

Grid card for a menu item. Handles:
- Image with fallback to empty placeholder on error
- "Popular" (fire icon) and "New" (star icon) badges
- Category badge (bottom-right of image)
- **Variant pills** (Plain/Assorted) — stops click propagation to prevent opening detail modal
- **Size pills** — same stop-propagation
- Add/Remove toggle button (green → red on hover when in cart)
- Clicking the card body calls `onOpenDetail(item)`

### 6.5 ItemDetailModal

**File:** `app/components/ui/ItemDetailModal.tsx`

Bottom sheet on mobile, centred modal on `sm+`. Animated slide-up via `requestAnimationFrame` + CSS transform.

Features:
- 16:9 hero image with gradient overlay
- Variant selector cards (with per-variant cart quantity badges)
- Size selector cards (with per-size cart quantity badges)
- Quantity counter (inline +/−) when item already in cart
- "Add to Cart" CTA when not in cart
- Live running price (qty × unit price shown above total)
- Closes on Escape or backdrop click

### 6.6 AuthModal

**File:** `app/components/ui/AuthModal.tsx`

Phone OTP authentication modal. Bottom sheet on mobile, centred modal on desktop.

Steps rendered as separate sub-components:

| Sub-component | Renders |
|---|---|
| `StepPhone` | Ghana (+233) flag prefix + phone input; validates ≥ 9 digits |
| `StepOTP` | `OTPInput` (6 individual boxes, paste-aware); resend with 30s cooldown; dev OTP auto-fill banner |
| `StepName` | Name input with "Skip for now" (saves as "Guest") |
| `StepDoneWelcome` | Success screen; auto-closes after 2.2s; animated progress bar |

`OTPInput` features: individual input boxes, auto-advance on digit entry, backspace-to-previous, paste support.

Resets to `phone` step when re-opened (unless user is already logged in).

### 6.7 BranchSelectorModal

**File:** `app/components/ui/BranchSelectorModal.tsx`

Global bottom sheet / centred modal for branch selection. Triggered by `ModalProvider.openBranchSelector()`.

Shows all branches sorted by distance. Closed branches are disabled. Selecting a branch with cart items triggers the conflict flow (same as CartDrawer).

### 6.8 LocationRequestModal

**File:** `app/components/ui/LocationRequestModal.tsx`

Prompt shown to request browser geolocation permission. Displayed globally.

### 6.9 HeroSearch

**File:** `app/components/sections/HeroSearch.tsx`

Row 1: `DynamicGreeting` card (left, fixed width) + `PromoBanner` (right, flex-1).
Row 2: `UniversalSearch` + category quick-filter pill row (powered by `HeroSearchCategoryItems`).

### 6.10 DynamicGreeting

**File:** `app/components/ui/DynamicGreeting.tsx`

Gradient card (amber/gold) with diagonal line pattern overlay and glow blob. Shows time-based greeting (Morning/Afternoon/Evening), `LocationBadge` with current branch and distance, and an open/closed badge for the selected branch.

### 6.11 MenuGrid

**File:** `app/components/ui/MenuGrid.tsx`

Home page grid component. Three display modes:

1. **Default (no search, no category):** Shows "CediBites Mix" — a curated selection defined by `MIX_CONFIG`:
   - 2 × Basic Meals (most popular first)
   - 2 × Combos
   - 2 × Budget Bowls
   - 1 × Top Ups
   - 1 × Drinks

2. **Most Popular category:** Shows all items with `popular: true`

3. **Search or other category:** Shows `filteredItems` from `MenuDiscoveryProvider`

### 6.12 UniversalSearch

**File:** `app/components/ui/UniversalSearch.tsx`

Search input connected to `MenuDiscoveryProvider.setSearchQuery`. Presumably includes search suggestions (file not deeply reviewed but referenced in HeroSearch).

### 6.13 Order Components

**`OrderTimeline`** (`app/components/order/OrderTimeline.tsx`)
Renders a vertical timeline. Each event shows a circle icon (filled = done/active, empty dot = pending), label, timestamp (if available), and description. Active step has a pulsing dot and "Current Status" label.

**`OrderDetails`** (`app/components/order/OrderDetails.tsx`)
Collapsible card showing order items (with images/icons), subtotal, delivery fee, tax, total, and payment method label + paid badge.

**`LiveMap`** (`app/components/order/LiveMap.tsx`)
Google Maps instance with three markers:
- Branch (orange circle, `#e49925`)
- Customer location (green circle, `#6c833f`)
- Rider (orange circle, larger, with BOUNCE animation that stops after 2s)

`fitBounds` is called to frame all visible markers. Shows graceful error state if `window.google` is unavailable. Map options hide POI labels, street view, and map type controls.

---

## 7. Data Layer

### 7.1 Menu Data

**File:** `lib/data/SampleMenu.ts`

**Current menu (19 items):**

| Category | Items |
|---|---|
| Basic Meals | Fried Rice with Chicken Drumsticks (plain/assorted variants), Jollof Rice with Chicken Drumsticks (plain/assorted), Assorted Noodles, Banku with Tilapia |
| Budget Bowls | Jollof Bowl, Fried Rice Bowl, Assorted Jollof Bowl, Assorted Fried Rice Bowl, Assorted Noodles Bowl (all in Small/Large sizes) |
| Combos | Banku × Grilled Tilapia, Street Budget (FR/Jollof + 3 drums), Street Budget (Assorted + 3 drums), Big Budget (FR/Jollof + 5 drums), Big Budget (Assorted + 5 drums) |
| Top Ups | Rotisserie Full (GHS 300), Half (GHS 160), Quarter (GHS 90), Chicken Basket 10pc (GHS 110), Chicken Basket 15pc (GHS 150) |
| Drinks | Sobolo (350ml/500ml), Asaana (350ml/500ml), Pineapple Ginger Juice (350ml/500ml), Bottled Water (500ml/1L) |

**Pricing model:**
Items use one of three patterns:
1. `price: number` — single flat price
2. `sizes: MenuItemSize[]` — size-keyed prices
3. `hasVariants: true, variants: { plain, assorted }` — variant-keyed prices

**Note:** The `BranchProvider` still uses legacy integer IDs (`'1'`–`'34'`) for `menuItemIds`. The `SampleMenu` now uses string slug IDs (`'fried-rice'`, `'jollof'`, etc.). This is a known discrepancy — see [Known Stubs & TODOs](#15-known-stubs--todos).

### 7.2 Hero Category Items

**File:** `lib/data/HeroSearchCategoryItems.ts`

Simple array of `{ id, label }` objects for the home page category pill strip: Most Popular, Basic Meals, Budget Bowls, Combos, Top Ups, Drinks.

### 7.3 Order Mock Data

**File:** `types/order.ts`

4 mock orders used for `/orders/[orderCode]` and `/order-history`:

| Order # | Status | Type | Payment |
|---|---|---|---|
| CB847291 | out_for_delivery | delivery | MoMo (paid) |
| CB391045 | delivered | delivery | cash |
| CB204837 | completed | pickup | cash |
| CB173920 | completed | delivery | MoMo (paid) |

Timelines are auto-generated by `buildDeliveryTimeline` / `buildPickupTimeline` based on order status and `placedAt` timestamp.

---

## 8. Utilities

### `lib/utils/distance.ts`

| Function | Description |
|---|---|
| `calculateDistance(lat1, lon1, lat2, lon2)` | Haversine formula, returns distance in km (1 decimal place) |
| `formatDistance(km)` | Returns `"350m"` under 1km, `"1.5km"` above |
| `estimateDeliveryTime(km)` | `baseTime=15min` + `travelTime=(km/30)*60min` → returns `"N-N+10 mins"` |

---

## 9. Types

### `types/order.ts`

Core domain types:

```typescript
OrderStatus  = 'received' | 'preparing' | 'ready' | 'out_for_delivery' |
               'delivered' | 'ready_for_pickup' | 'completed' | 'cancelled'
OrderSource  = 'online' | 'phone' | 'whatsapp' | 'instagram' | 'facebook' | 'pos'
OrderType    = 'delivery' | 'pickup'
PaymentMethod = 'momo' | 'cash_delivery' | 'cash_pickup'
```

`STATUS_CONFIG` — maps each status to display label, CSS color class, and background class.
`PAY_LABEL` — maps payment method to human label.
`timeAgo(ts)` — relative time string (e.g. "22m ago", "Yesterday").
`formatTime(ts)` — locale time string for Ghana (`en-GH`).
`staticMapUrl(lat, lng)` — generates Google Static Maps URL.
`directionsUrl(lat, lng)` — Google Maps directions deep link.

---

## 10. Authentication Flow

```
User clicks "Sign In"
  → ModalProvider.openAuth()
  → AuthModal opens
  → AuthProvider.authStep = 'phone'

[Step 1 — Phone]
  User enters phone number (Ghana +233 prefix auto-prepended)
  → AuthProvider.sendOTP(phone)
    → generates 6-digit OTP in memory
    → DEV: logs to console, exposes via devOTP state
    → PROD: stub comment shows Africa's Talking / Hubtel integration point
  → authStep = 'otp'

[Step 2 — OTP]
  User enters 6-digit code (6 individual input boxes)
  Auto-submits when all 6 digits filled
  → AuthProvider.verifyOTP(code)
    → if code matches generatedOTP:
        if existing user with same phone in localStorage → authStep = 'done'
        else → authStep = 'naming'
    → if code wrong → error shown, inputs cleared

[Step 3 — Name (new users only)]
  User enters name (can skip → saved as "Guest")
  → AuthProvider.saveProfile(name, phone)
  → authStep = 'done'

[Step 4 — Welcome]
  Auto-closes after 2.2s

Session stored as JSON in localStorage key: cedibites-auth-user
  { name, phone, savedAddresses, createdAt }
```

---

## 11. Cart & Branch Switching Logic

When a user selects a new branch (from CartDrawer, BranchSelectorModal, or checkout inline sheet):

```
1. Is new branch same as current?  → close, no-op

2. Is cart empty?  → switch immediately

3. validateCartForBranch(newBranch.menuItemIds)
   → splits cart into { available[], unavailable[] }

4. No conflicts?  → switch immediately

5. Conflicts exist?  → show conflict view:
   - List of unavailable items (red)
   - List of still-available items (green)
   - Options:
     a. "Remove N items & Switch" → removeUnavailableItems() → setSelectedBranch()
     b. "Keep [current] Branch" → cancel
     c. "Pick a different branch" → back to branch list
```

---

## 12. Checkout Flow

```
EmptyCartGuard check → redirect to "cart empty" screen if no items

Step 1 — Details
  - Choose Delivery or Pickup
  - Shows branch being delivered from / pickup location
  - Full Name (required)
  - Phone Number (required)
  - Delivery Address (required for delivery) — Google Places / Nominatim search
  - Note to rider (optional)
  - → "Continue to Payment" (disabled until name + phone + address filled)

Step 2 — Payment
  - Shows delivery summary (address or pickup branch) with edit link
  - Payment method selection:
    - Mobile Money (MoMo): MTN / Telecel / AirtelTigo + phone number
    - Cash on Delivery (delivery orders only)
    - Cash at Pickup (pickup orders only)
  - → "Place Order" / "Pay & Place Order"
    → 1800ms simulated processing
    → generates order code: CB + last 6 digits of Date.now()
    → clears cart
    → goes to step 3

Step 3 — Confirmed
  - Order number, ETA, delivery destination
  - "Confirmation SMS sent to [phone]" notice
  - If not logged in: "Save info for next time?" prompt
    → saveFromCheckout(name, phone) → localStorage
  - CTAs: "Track My Order" → /orders | "Back to Menu" → /
```

---

## 13. Order Tracking Flow

```
/orders  →  user enters 8-char order code (CB######)
  → validates format with /^CB\d{6}$/
  → navigates to /orders/[code]

/orders/[code]
  → getMockOrder(code) lookup
  → if not found: "Order Not Found" screen

  If found:
  - Header: order number, placed time, share button
  - Left column:
    - Live Status banner (delivery + out_for_delivery status only)
    - LiveMap (delivery orders only)
    - OrderDetails (collapsible items + pricing)
  - Right column:
    - OrderTimeline (status steps with timestamps)
    - Delivery address
    - Call Branch / Call Rider contacts
    - Branch info
```

---

## 14. Google Maps Integration

The Google Maps JS API script is loaded in `app/layout.tsx` via `<Script strategy="beforeInteractive">` with the `places` library:

```
https://maps.googleapis.com/maps/api/js?key=...&libraries=places
```

### Usage Points

| Component | Usage |
|---|---|
| `LiveMap` | Full interactive map with branch/customer/rider markers |
| `AddressSearchField` (checkout) | `google.maps.places.AutocompleteService` for delivery address autocomplete; Nominatim as fallback if Google isn't loaded |

### Fallback
If `window.google` is not available, `AddressSearchField` falls back to the Nominatim API (`nominatim.openstreetmap.org`) with Ghana-biased bounding box. `LiveMap` shows a "Map Not Available" error state.

---

## 15. Known Stubs & TODOs

| Location | Description |
|---|---|
| `AuthProvider.sendOTP` | OTP is only generated in memory. Production requires Africa's Talking or Hubtel SMS integration. Commented code is provided. |
| `orders/[orderCode]/page.tsx` | WebSocket block is commented out. Real-time tracking requires a `wss://` endpoint. |
| `order-history/page.tsx` | `isLoggedIn` is hardcoded `false`. Needs to read from `AuthProvider`. Order fetching is mocked — needs real API by user ID or IP. |
| `order-history/page.tsx` | Reorder button logs to console and navigates to `/`. Actual cart re-add is not implemented. |
| `BranchProvider` `menuItemIds` | Branch `menuItemIds` still use legacy numeric string IDs (`'1'`–`'34'`). The live `sampleMenuItems` now uses slug IDs (`'fried-rice'`, `'jollof'`, etc.). Cart branch validation will not work correctly until `menuItemIds` are updated to match the new slug IDs. |
| `CheckoutPage.handlePlaceOrder` | Order placement is simulated with a 1800ms timeout. Real implementation needs a payment API call (Hubtel noted as payment processor). |
| Location caching | `user-location` is stored without TTL enforcement. The stored `timestamp` field exists but is never read to expire the cache. |
| `menuaudit/page.tsx` | No auth/access control — accessible to anyone who knows the URL. |
| `UniversalSearch` | Detailed implementation not covered in audit — verify search-results dropdown behaviour. |

---

*Documentation written by RichardSomda — February 2026*

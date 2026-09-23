import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  finishIndex: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; productId: string; finishIndex: number; quantity?: number }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'SET_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR' };

const STORAGE_KEY = 'skevos-cart';

function makeId(productId: string, finishIndex: number) {
  return `${productId}-${finishIndex}`;
}

function loadInitialItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item && typeof item.id === 'string' && typeof item.productId === 'string' &&
        typeof item.finishIndex === 'number' && typeof item.quantity === 'number'
    );
  } catch {
    return [];
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const id = makeId(action.productId, action.finishIndex);
      const quantity = action.quantity ?? 1;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return {
        items: [...state.items, { id, productId: action.productId, finishIndex: action.finishIndex, quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.id !== action.id) };
    case 'SET_QUANTITY': {
      if (action.quantity <= 0) {
        return { items: state.items.filter((item) => item.id !== action.id) };
      }
      return {
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, finishIndex: number, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({ items: loadInitialItems() }));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // localStorage unavailable — cart still works for this session
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (productId, finishIndex, quantity) => dispatch({ type: 'ADD_ITEM', productId, finishIndex, quantity }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
      setQuantity: (id, quantity) => dispatch({ type: 'SET_QUANTITY', id, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
    }),
    [state.items, isDrawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

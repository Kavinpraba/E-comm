import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { api } from '../services/api.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'northstar-cart';
const OWNER_KEY = 'northstar-cart-owner';

function readLocalCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user, ready } = useAuth();
  const [items, setItems] = useState(readLocalCart);
  const previousUser = useRef(user);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const writeQueue = useRef(Promise.resolve());
  const activeWrites = useRef(0);

  const saveToApi = useCallback((nextItems) => {
    if (!user) return Promise.resolve();
    activeWrites.current += 1;
    setSyncing(true);
    setSyncError('');
    const request = writeQueue.current.catch(() => {}).then(() => api('/cart', {
        method: 'PUT',
        body: JSON.stringify({
          items: nextItems.map((item) => ({ product: item._id, quantity: item.quantity })),
        }),
      }));
    writeQueue.current = request.catch(() => {});
    return request.catch((error) => {
      setSyncError(error.message);
      throw error;
    }).finally(() => {
      activeWrites.current -= 1;
      setSyncing(activeWrites.current > 0);
    });
  }, [user]);

  const persist = useCallback((nextItems) => {
    setItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    localStorage.setItem(OWNER_KEY, user?.id || 'guest');
    saveToApi(nextItems).catch((error) => console.error('Cart sync failed:', error.message));
  }, [user, saveToApi]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      if (previousUser.current) {
        setItems([]);
        localStorage.setItem(STORAGE_KEY, '[]');
        localStorage.setItem(OWNER_KEY, 'guest');
      }
      previousUser.current = user;
      return;
    }
    previousUser.current = user;
    let active = true;
    setSyncing(true);
    api('/cart')
      .then(({ items: saved }) => {
        if (!active) return;
        const serverItems = saved
          .filter((item) => item.product)
          .map(({ product, quantity }) => ({ ...product, quantity }));
        const localItems = readLocalCart();
        const isGuestCart = localStorage.getItem(OWNER_KEY) === 'guest';
        const merged = [...serverItems];
        if (isGuestCart) {
          for (const local of localItems) {
            const existing = merged.find((item) => item._id === local._id);
            if (existing) existing.quantity = Math.min(existing.quantity + local.quantity, existing.stock);
            else if (local.stock > 0) merged.push({ ...local, quantity: Math.min(local.quantity, local.stock) });
          }
        }
        setItems(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem(OWNER_KEY, user.id);
        return saveToApi(merged);
      })
      .catch((error) => {
        if (active) {
          setSyncError(error.message);
          console.error('Could not load saved cart:', error.message);
        }
      })
      .finally(() => {
        if (active) setSyncing(activeWrites.current > 0);
      });
    return () => { active = false; };
  }, [ready, user, saveToApi]);

  const addItem = (product) => {
    const current = items.find((item) => item._id === product._id);
    if (current && current.quantity >= product.stock) {
      throw new Error('You have added all available stock for this item.');
    }
    if (!current && product.stock < 1) throw new Error('This item is out of stock.');
    persist(current
      ? items.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { ...product, quantity: 1 }]);
  };

  const changeQuantity = (id, amount) => {
    persist(items
      .map((item) => item._id === id
        ? { ...item, quantity: Math.min(item.stock, item.quantity + amount) }
        : item)
      .filter((item) => item.quantity > 0));
  };

  const removeItem = (id) => persist(items.filter((item) => item._id !== id));
  const clearCart = () => persist([]);
  const retrySync = () => saveToApi(items).catch((error) => console.error('Cart sync failed:', error.message));
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({
    items, count, subtotal, syncing, syncError, retrySync, addItem, changeQuantity, removeItem, clearCart,
  }), [items, count, subtotal, syncing, syncError, persist, saveToApi]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider.');
  return context;
}

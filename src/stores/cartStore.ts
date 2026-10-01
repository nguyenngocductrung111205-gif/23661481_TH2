import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: { id: number; title: string; price: number; image: string }) => void;
  removeItem: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        const existingIndex = items.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }],
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      changeQty: (id, delta) => {
        const { items } = get();
        const updated = items
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({ items: updated });
      },
      clearCart: () => set({ items: [] }),
      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      totalAmount: () => {
        return get().items.reduce(
          (sum, item) => sum + Math.round(item.price * PRICE_MULTIPLIER) * item.quantity,
          0
        );
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;

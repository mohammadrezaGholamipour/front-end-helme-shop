import type { CartStoreItem, AddCartPayload } from '~/types';
import { defineStore } from 'pinia';



const STORAGE_KEY = 'helma-cart';

export const useCartStore = defineStore('cart', () => {
    const cartItems = ref<CartStoreItem[]>([]);

    const persistCart = (): void => {
        if (!import.meta.client) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value));
    };

    const restoreCart = (): void => {
        if (!import.meta.client) return;

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            const parsed = JSON.parse(raw) as CartStoreItem[];
            if (Array.isArray(parsed)) {
                cartItems.value = parsed;
            }
        } catch {
            cartItems.value = [];
        }
    };

    const findItemIndex = (id: number, variantId?: number): number => {
        return cartItems.value.findIndex((item) => {
            if (variantId != null && item.variantId != null) {
                return item.id === id && item.variantId === variantId;
            }
            return item.id === id;
        });
    };

    const addToCart = (payload: AddCartPayload): void => {
        const quantity = payload.quantity ?? 1;
        const existingIndex = findItemIndex(payload.id, payload.variantId);

        if (existingIndex > -1) {
            const existingItem = cartItems.value[existingIndex];
            if (existingItem) {
                existingItem.quantity += quantity;
            }
        } else {
            cartItems.value.push({
                id: payload.id,
                name: payload.name,
                slug: payload.slug,
                image: payload.image,
                price: payload.price,
                quantity,
                variantId: payload.variantId,
            });
        }
    };

    const removeFromCart = (productId: number, variantId?: number): void => {
        cartItems.value = cartItems.value.filter((item) => {
            if (variantId != null) {
                return !(item.id === productId && item.variantId === variantId);
            }
            return item.id !== productId;
        });
    };

    const increaseQuantity = (productId: number, variantId?: number): void => {
        const item = cartItems.value.find((item) => {
            if (variantId != null) {
                return item.id === productId && item.variantId === variantId;
            }
            return item.id === productId;
        });
        if (!item) return;
        item.quantity += 1;
    };

    const decreaseQuantity = (productId: number, variantId?: number): void => {
        const item = cartItems.value.find((item) => {
            if (variantId != null) {
                return item.id === productId && item.variantId === variantId;
            }
            return item.id === productId;
        });
        if (!item) return;

        if (item.quantity <= 1) {
            removeFromCart(productId, variantId);
            return;
        }

        item.quantity -= 1;
    };

    const clearCart = (): void => {
        cartItems.value = [];
    };

    const totalItems = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
    });

    const totalPrice = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    if (process.client) {
        restoreCart();
        watch(cartItems, persistCart, { deep: true });
    }

    return {
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
    };
});

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  apiItems: [],
  count: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // إضافة منتج للسلة المحلية
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      state.count = calculateTotalCount(state);
    },

    // تقليل كمية منتج في السلة المحلية
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        state.count = calculateTotalCount(state);
      }
    },

    // إزالة منتج من السلة المحلية
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      state.count = calculateTotalCount(state);
    },

    // تعيين منتجات السلة من السيرفر
    setApiCartItems: (state, action) => {
      state.apiItems = action.payload;
      state.count = calculateTotalCount(state);
      state.status = 'succeeded';
    },

    // تحديث حالة السلة عند جلب البيانات
    setCartLoading: (state) => {
      state.status = 'loading';
    },

    // تعيين خطأ عند فشل جلب البيانات
    setCartError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    // مسح السلة بالكامل
    clearCart: (state) => {
      state.items = [];
      state.apiItems = [];
      state.count = 0;
      state.status = 'idle';
      state.error = null;
    }
  }
});

// دالة مساعدة لحساب العدد الإجمالي
const calculateTotalCount = (state) => {
  const localCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const apiCount = state.apiItems.reduce((total, item) => total + item.quantity, 0);
  return localCount + apiCount;
};

// Selectors ميموايزة لتحسين الأداء
export const selectAllCartItems = createSelector(
  [(state) => state.cart.items, (state) => state.cart.apiItems],
  (items, apiItems) => [...items, ...apiItems]
);

export const selectCartCount = createSelector(
  [selectAllCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalPrice = createSelector(
  [selectAllCartItems],
  (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

// تصدير الـ actions
export const {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  setApiCartItems,
  setCartLoading,
  setCartError,
  clearCart
} = cartSlice.actions;

// تصدير الـ reducer
export default cartSlice.reducer;
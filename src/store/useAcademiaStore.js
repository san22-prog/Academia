import { create } from 'zustand';
import { PRODUCTS } from '../lib';

const initialState = {
  screen: 'auth',
  authMode: 'login',
  name: '',
  email: '',
  password: '',
  user: { name: 'Campus Buddy', email: 'hello@academia.mu' },
  search: '',
  category: 'All Products',
  priceRange: 'Any price',
  filterDraft: {
    category: 'All Products',
    priceRange: 'Any price',
  },
  filterOpen: false,
  selectedProduct: PRODUCTS[0],
  cart: {},
  favourites: [],
  editProfile: false,
  toast: '',
  toastTimer: null,
};

export const useAcademiaStore = create((set, get) => ({
  ...initialState,

  setScreen: (screen) => set({ screen, editProfile: false }),
  setAuthMode: (authMode) => set({ authMode }),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setUser: (user) => set({ user }),
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setFilterDraft: (updater) =>
    set((state) => ({
      filterDraft: typeof updater === 'function' ? updater(state.filterDraft) : updater,
    })),
  setFilterOpen: (filterOpen) => set({ filterOpen }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setCart: (updater) =>
    set((state) => ({
      cart: typeof updater === 'function' ? updater(state.cart) : updater,
    })),
  setFavourites: (updater) =>
    set((state) => ({
      favourites: typeof updater === 'function' ? updater(state.favourites) : updater,
    })),
  setEditProfile: (editProfile) => set({ editProfile }),
  setToast: (toast) => set({ toast }),

  notify: (message) => {
    const timer = get().toastTimer;
    if (timer) clearTimeout(timer);

    const nextTimer = setTimeout(() => set({ toast: '', toastTimer: null }), 2200);
    set({ toast: message, toastTimer: nextTimer });
  },

  clearToastTimer: () => {
    const timer = get().toastTimer;
    if (timer) clearTimeout(timer);
    set({ toastTimer: null });
  },

  openFilters: () =>
    set((state) => ({
      filterDraft: {
        category: state.category,
        priceRange: state.priceRange,
      },
      filterOpen: true,
    })),

  applyFilters: () =>
    set((state) => ({
      category: state.filterDraft.category,
      priceRange: state.filterDraft.priceRange,
      filterOpen: false,
    })),

  clearFilters: () =>
    set({
      filterDraft: {
        category: 'All Products',
        priceRange: 'Any price',
      },
    }),

  toggleFavorite: (id) =>
    set((state) => ({
      favourites: state.favourites.includes(id)
        ? state.favourites.filter((item) => item !== id)
        : [...state.favourites, id],
    })),

  addToCart: (product) =>
    set((state) => ({
      cart: {
        ...state.cart,
        [product.id]: (state.cart[product.id] || 0) + 1,
      },
    })),

  changeQuantity: (id, delta) =>
    set((state) => {
      const next = { ...state.cart };
      const value = (next[id] || 0) + delta;
      if (value <= 0) delete next[id];
      else next[id] = value;
      return { cart: next };
    }),

  navigate: (next) =>
    set((state) => ({
      editProfile: false,
      screen: next,
    })),
}));

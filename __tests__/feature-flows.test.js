const { filterProducts } = require('../src/helpers/filterProducts');
const { validateAuthInput } = require('../src/helpers/auth');
const { useAcademiaStore } = require('../src/store/useAcademiaStore');
const { PRODUCTS } = require('../src/lib');

describe('Academia feature flows', () => {
  beforeEach(() => {
    useAcademiaStore.setState({
      screen: 'auth',
      authMode: 'login',
      name: '',
      email: '',
      password: '',
      user: { name: 'Campus Buddy', email: 'hello@academia.mu' },
      search: '',
      category: 'All Products',
      priceRange: 'Any price',
      filterDraft: { category: 'All Products', priceRange: 'Any price' },
      filterOpen: false,
      selectedProduct: PRODUCTS[0],
      cart: {},
      favourites: [],
      editProfile: false,
      toast: '',
      toastTimer: null,
    });
  });

  it('filters products by category, search, and price range', () => {
    const result = filterProducts(PRODUCTS, {
      category: 'Paper & Planning',
      search: 'sticky',
      priceRange: 'Under Rs 150',
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.category === 'Paper & Planning')).toBe(true);
    expect(result.every((product) => product.price < 150)).toBe(true);
    expect(result.some((product) => /sticky/i.test(product.name))).toBe(true);
  });

  it('validates auth fields for login and signup', () => {
    expect(validateAuthInput({ mode: 'login', email: 'hello@example.com', password: 'secret' })).toEqual({ valid: true });
    expect(validateAuthInput({ mode: 'signup', name: '', email: 'bad', password: '1' })).toEqual({
      valid: false,
      title: 'One tiny thing!',
      message: 'Please enter your name to create your Academia account.',
    });
    expect(validateAuthInput({ mode: 'signup', name: 'Ava', email: 'bad', password: '1234' })).toEqual({
      valid: false,
      title: 'Check your email',
      message: 'Please enter a valid email address.',
    });
    expect(validateAuthInput({ mode: 'signup', name: 'Ava', email: 'ava@example.com', password: '1' })).toEqual({
      valid: false,
      title: 'Almost there',
      message: 'Enter a password with at least 4 characters for this demo.',
    });
  });

  it('adds, updates, removes cart items, and toggles favorites', () => {
    const product = PRODUCTS[0];

    useAcademiaStore.getState().addToCart(product);
    useAcademiaStore.getState().changeQuantity(product.id, 1);
    expect(useAcademiaStore.getState().cart[product.id]).toBe(2);

    useAcademiaStore.getState().changeQuantity(product.id, -1);
    expect(useAcademiaStore.getState().cart[product.id]).toBe(1);

    useAcademiaStore.getState().changeQuantity(product.id, -1);
    expect(useAcademiaStore.getState().cart[product.id]).toBeUndefined();

    useAcademiaStore.getState().toggleFavorite(product.id);
    expect(useAcademiaStore.getState().favourites).toContain(product.id);
  });

  it('opens and applies filters from the store', () => {
    const productId = PRODUCTS[0].id;

    useAcademiaStore.getState().toggleFavorite(productId);
    useAcademiaStore.getState().openFilters();
    useAcademiaStore.getState().setFilterDraft({ category: 'Paper & Planning', priceRange: 'Under Rs 150' });
    useAcademiaStore.getState().applyFilters();

    expect(useAcademiaStore.getState().favourites).toContain(productId);
    expect(useAcademiaStore.getState().category).toBe('Paper & Planning');
    expect(useAcademiaStore.getState().priceRange).toBe('Under Rs 150');
    expect(useAcademiaStore.getState().filterOpen).toBe(false);
  });

  it('updates profile and navigation state', () => {
    useAcademiaStore.getState().setUser({ name: 'Ava', email: 'ava@example.com' });
    useAcademiaStore.getState().navigate('profile');

    expect(useAcademiaStore.getState().user).toEqual({ name: 'Ava', email: 'ava@example.com' });
    expect(useAcademiaStore.getState().screen).toBe('profile');
  });

  it('stores toast messages and clears them on notify', () => {
    jest.useFakeTimers();
    useAcademiaStore.getState().notify('Saved!');

    expect(useAcademiaStore.getState().toast).toBe('Saved!');
    jest.runAllTimers();
    expect(useAcademiaStore.getState().toast).toBe('');
    jest.useRealTimers();
  });
});

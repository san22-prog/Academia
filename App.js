import React, { useEffect, useMemo, useRef, useState } from 'react';
import { C, PRODUCTS, CATEGORIES, PRICE_RANGES, money } from './src/lib';
import { filterProducts } from './src/helpers';
import { styles } from './src/styles';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AuthScreen, HomeScreen, DetailScreen, CartScreen, ProfileScreen } from './src/screens';

export default function App() {
  const [screen, setScreen] = useState('auth');
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({ name: 'Campus Buddy', email: 'hello@academia.mu' });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState('Any price');
  const [filterDraft, setFilterDraft] = useState({
  category: 'All Products',
  priceRange: 'Any price',
});
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [cart, setCart] = useState({});
  const [favourites, setFavourites] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [toast, setToast] = useState('');
  const fade = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef(null);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [screen, fade]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const cartItems = useMemo(() => Object.keys(cart).map((id) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return product ? { ...product, quantity: cart[id] } : null;
  }).filter(Boolean), [cart]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 500 ? 0 : 40;
  const total = subtotal + delivery;

 
const filteredProducts = useMemo(() => filterProducts(PRODUCTS, { category, search, priceRange }), [category, search, priceRange]);


  const notify = (message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const addToCart = (product) => {
    setCart((previous) => ({ ...previous, [product.id]: (previous[product.id] || 0) + 1 }));
    notify(`${product.name} added to your bag ♡`);
  };
  const changeQuantity = (id, delta) => {
    setCart((previous) => {
      const next = { ...previous };
      const value = (next[id] || 0) + delta;
      if (value <= 0) delete next[id]; else next[id] = value;
      return next;
    });
  };
  const toggleFavorite = (id) => {
    setFavourites((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);
  };
  const navigate = (next) => { setEditProfile(false); setScreen(next); };

  const handleAuth = () => {
    if (authMode === 'signup' && !name.trim()) {
      Alert.alert('One tiny thing!', 'Please enter your name to create your Academia account.'); return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      Alert.alert('Check your email', 'Please enter a valid email address.'); return;
    }
    if (password.trim().length < 4) {
      Alert.alert('Almost there', 'Enter a password with at least 4 characters for this demo.'); return;
    }
    const displayName = authMode === 'signup' ? name.trim() : (name.trim() || email.split('@')[0] || 'Campus Buddy');
    setUser({ name: displayName, email: email.trim() });
    setScreen('home');
  };

  const openFilters = () => {
    setFilterDraft({ category, priceRange });
    setFilterOpen(true);
  };
  const applyFilters = () => {
    setCategory(filterDraft.category); setPriceRange(filterDraft.priceRange); setFilterOpen(false);
  };
  const clearFilters = () => setFilterDraft({ category: 'All Products', priceRange: 'Any price' });

  const renderAuth = () => (
    <AuthScreen
      styles={styles}
      authMode={authMode}
      setAuthMode={setAuthMode}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleAuth={handleAuth}
      setUser={setUser}
      setScreen={setScreen}
    />
  );

  const renderHome = () => (
    <HomeScreen
      styles={styles}
      user={user}
      search={search}
      setSearch={setSearch}
      category={category}
      setCategory={setCategory}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      openFilters={openFilters}
      setSelectedProduct={setSelectedProduct}
      setScreen={setScreen}
      addToCart={addToCart}
      toggleFavorite={toggleFavorite}
      favourites={favourites}
      filteredProducts={filteredProducts}
      cartCount={cartCount}
      navigate={navigate}
    />
  );

  const renderDetail = () => (
    <DetailScreen
      styles={styles}
      selectedProduct={selectedProduct}
      favourites={favourites}
      toggleFavorite={toggleFavorite}
      addToCart={addToCart}
      setScreen={setScreen}
      cartCount={cartCount}
      navigate={navigate}
      money={money}
    />
  );

  const renderCart = () => (
    <CartScreen
      styles={styles}
      cartItems={cartItems}
      cartCount={cartCount}
      subtotal={subtotal}
      delivery={delivery}
      total={total}
      money={money}
      changeQuantity={changeQuantity}
      setCart={setCart}
      setSelectedProduct={setSelectedProduct}
      setScreen={setScreen}
      navigate={navigate}
    />
  );

  const renderProfile = () => (
    <ProfileScreen
      styles={styles}
      user={user}
      setUser={setUser}
      favourites={favourites}
      cartCount={cartCount}
      editProfile={editProfile}
      setEditProfile={setEditProfile}
      notify={notify}
      setPassword={setPassword}
      setScreen={setScreen}
      setAuthMode={setAuthMode}
      navigate={navigate}
    />
  );

  const renderFilters = () => (
    <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
      <View style={styles.modalBackdrop}><Pressable style={StyleSheet.absoluteFill} onPress={() => setFilterOpen(false)} /><View style={styles.filterSheet}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Find your kind of cute</Text><Text style={styles.sheetSubtitle}>A few little filters to help</Text></View><Pressable onPress={() => setFilterOpen(false)} style={styles.sheetClose}><Text style={styles.sheetCloseText}>×</Text></Pressable></View>
        <Text style={styles.filterLabel}>CATEGORY</Text><View style={styles.filterChips}>{CATEGORIES.map((item) => <Pressable key={item} onPress={() => setFilterDraft((p) => ({ ...p, category: item }))} style={[styles.pill, filterDraft.category === item && styles.pillActive]}><Text style={[styles.pillText, filterDraft.category === item && styles.pillTextActive]}>{item}</Text></Pressable>)}</View>
        <Text style={styles.filterLabel}>PRICE RANGE</Text><View style={styles.filterChips}>{PRICE_RANGES.map((item) => <Pressable key={item} onPress={() => setFilterDraft((p) => ({ ...p, priceRange: item }))} style={[styles.pill, filterDraft.priceRange === item && styles.pillActive]}><Text style={[styles.pillText, filterDraft.priceRange === item && styles.pillTextActive]}>{item}</Text></Pressable>)}</View>
        <View style={styles.filterActionRow}><Pressable onPress={clearFilters} style={[styles.button, styles.button_secondary, { flex: 1 }]}><Text style={[styles.buttonText, styles.buttonText_secondary]}>Reset</Text></Pressable><Pressable onPress={applyFilters} style={[styles.button, styles.button_primary, { flex: 1 }]}><Text style={[styles.buttonText, styles.buttonText_primary]}>Show my finds</Text></Pressable></View>
      </View></View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
      <View style={styles.appBackground}>
        <Animated.View style={[styles.screenFrame, { opacity: fade }]}>
          {screen === 'auth' ? renderAuth() : screen === 'home' ? renderHome() : screen === 'detail' ? renderDetail() : screen === 'cart' ? renderCart() : renderProfile()}
        </Animated.View>
        {renderFilters()}
        {toast && screen !== 'auth' ? <View pointerEvents="none" style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View> : null}
      </View>
    </SafeAreaView>
  );
}


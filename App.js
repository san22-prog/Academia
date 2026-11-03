import React, { useEffect, useMemo, useRef } from 'react';
import { C, PRODUCTS, CATEGORIES, PRICE_RANGES, money } from './src/lib';
import { filterProducts, validateAuthInput } from './src/helpers';
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
import { useAcademiaStore } from './src/store/useAcademiaStore';

export default function App() {
  const {
    screen,
    authMode,
    name,
    email,
    password,
    user,
    search,
    category,
    priceRange,
    filterDraft,
    filterOpen,
    selectedProduct,
    cart,
    favourites,
    editProfile,
    toast,
    setScreen,
    setAuthMode,
    setName,
    setEmail,
    setPassword,
    setUser,
    setSearch,
    setCategory,
    setPriceRange,
    setFilterDraft,
    setFilterOpen,
    setSelectedProduct,
    setCart,
    setFavourites,
    setEditProfile,
    setToast,
    notify,
    openFilters,
    applyFilters,
    clearFilters,
    toggleFavorite,
    addToCart,
    changeQuantity,
    navigate,
  } = useAcademiaStore();

  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [screen, fade]);

  useEffect(() => () => {
    const timer = useAcademiaStore.getState().toastTimer;
    if (timer) clearTimeout(timer);
  }, []);

  const cartItems = useMemo(() => Object.keys(cart).map((id) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return product ? { ...product, quantity: cart[id] } : null;
  }).filter(Boolean), [cart]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 500 ? 0 : 40;
  const total = subtotal + delivery;

 
const filteredProducts = useMemo(() => filterProducts(PRODUCTS, { category, search, priceRange }), [category, search, priceRange]);


  const handleAddToCart = (product) => {
    addToCart(product);
    notify(`${product.name} added to your bag ♡`);
  };

  const handleAuth = () => {
    const result = validateAuthInput({
      mode: authMode,
      name,
      email,
      password,
    });

    if (!result.valid) {
      Alert.alert(result.title, result.message);
      return;
    }

    const displayName = authMode === 'signup' ? name.trim() : (name.trim() || email.split('@')[0] || 'Campus Buddy');
    setUser({ name: displayName, email: email.trim() });
    setScreen('home');
  };

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
      addToCart={handleAddToCart}
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
      addToCart={handleAddToCart}
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


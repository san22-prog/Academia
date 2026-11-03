import React, { useEffect, useMemo, useRef, useState } from 'react';
import { products as catalogueProducts, categories } from './products';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const C = {
  ink: '#39364B', muted: '#89869B', pink: '#F2A7C6', deepPink: '#D96D9C', blush: '#FFF0F6',
  lavender: '#EEE9FF', lilac: '#8D82C8', blue: '#E8F4FF', mint: '#E8F7EF', yellow: '#FFF4D8',
  cream: '#FFFBF8', white: '#FFFFFF', line: '#F0E8ED', green: '#63B99B', red: '#D96F7F',
};




const PRODUCTS = catalogueProducts.map((product, index) => ({
  ...product,
  label: index < 10 ? 'Study favourite' : 'Everyday essential',
  color: ['#FFF0F6', '#EEE9FF', '#E8F4FF', '#E8F7EF'][index % 4],
  desc: product.description,
  image: null,
}));


const CATEGORIES = categories;

const PRICE_RANGES = ['Any price', 'Under Rs 150', 'Rs 150–250', 'Over Rs 250'];

const money = (n) => `Rs ${Number(n).toFixed(0)}`;

function Button({ title, onPress, variant = 'primary', style, textStyle, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, styles[`button_${variant}`], style, pressed && !disabled ? { opacity: 0.84, transform: [{ scale: 0.985 }] } : null, disabled ? { opacity: 0.45 } : null]}
    >
      <Text style={[styles.buttonText, styles[`buttonText_${variant}`], textStyle]}>{title}</Text>
    </Pressable>
  );
}

function BrandMark({ small = false }) {
  return (
    <View style={[styles.brandMark, small && styles.brandMarkSmall]}>
      <Text style={[styles.brandMarkText, small && styles.brandMarkTextSmall]}>a.</Text>
    </View>
  );
}

function Pill({ title, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{title}</Text>
    </Pressable>
  );
}

function ProductCard({ product, onOpen, onAdd, favorite, onFavorite }) {
  return (
    <View style={styles.productCard}>
      <Pressable onPress={onOpen} style={styles.productImageWrap}>
        <Image source={product.image} style={styles.productImage} resizeMode="contain" />
        <View style={styles.productLabel}><Text style={styles.productLabelText}>{product.label}</Text></View>
      </Pressable>
      <Pressable onPress={onFavorite} style={styles.heartButton} accessibilityLabel={favorite ? 'Remove from favourites' : 'Add to favourites'}>
        <Text style={[styles.heartText, favorite && { color: C.deepPink }]}>{favorite ? '♥' : '♡'}</Text>
      </Pressable>
      <Pressable onPress={onOpen} style={styles.productInfo}>
        <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>{money(product.price)}</Text>
         
        </View>
      </Pressable>
      <Pressable onPress={onAdd} style={styles.addMini} accessibilityLabel={`Add ${product.name} to cart`}>
        <Text style={styles.addMiniText}>+</Text>
      </Pressable>
    </View>
  );
}

function BottomNav({ active, onNavigate, cartCount }) {
  const tabs = [
    { key: 'home', icon: '⌂', label: 'Home' },
    { key: 'cart', icon: '♡', label: 'My bag' },
    { key: 'profile', icon: '☺', label: 'Profile' },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <Pressable key={tab.key} onPress={() => onNavigate(tab.key)} style={styles.navItem}>
          <View style={[styles.navIconWrap, active === tab.key && styles.navIconWrapActive]}>
            <Text style={[styles.navIcon, active === tab.key && styles.navIconActive]}>{tab.icon}</Text>
            {tab.key === 'cart' && cartCount > 0 ? <View style={styles.navBadge}><Text style={styles.navBadgeText}>{cartCount}</Text></View> : null}
          </View>
          <Text style={[styles.navLabel, active === tab.key && styles.navLabelActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

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

 
const filteredProducts = useMemo(() => PRODUCTS.filter((p) => {
  const matchesCategory =
    category === 'All Products' || p.category === category;

  const q = search.trim().toLowerCase();

  const matchesSearch =
    !q || `${p.name} ${p.category}`.toLowerCase().includes(q);

  let matchesPrice = true;

  if (priceRange === 'Under Rs 150') {
    matchesPrice = p.price < 150;
  }

  if (priceRange === 'Rs 150–250') {
    matchesPrice = p.price >= 150 && p.price <= 250;
  }

  if (priceRange === 'Over Rs 250') {
    matchesPrice = p.price > 250;
  }

  return matchesCategory && matchesSearch && matchesPrice;
}), [category, search, priceRange]);


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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.authScreen}>
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.authDecorTop}><View style={styles.decorDotPink} /><View style={styles.decorDotBlue} /><Text style={styles.decorSparkle}>✦</Text></View>
        <BrandMark />
        <Text style={styles.authBrand}>academia</Text>
        <Text style={styles.authTagline}>little things for big ideas</Text>
        <View style={styles.authIllustration}>
          <Image source={require('./assets/products/cloud-notebook.png')} style={styles.authProductArt} resizeMode="contain" />
          <View style={styles.authSticker}><Text style={styles.authStickerText}>✿ study happy ✿</Text></View>
        </View>
        <View style={styles.authCard}>
          <Text style={styles.authHeading}>{authMode === 'login' ? 'Welcome back!' : 'Let’s make it official'}</Text>
          <Text style={styles.authSubheading}>{authMode === 'login' ? 'Your next favourite study essential awaits.' : 'Create an account for your stationery wishlist.'}</Text>
          {authMode === 'signup' ? <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={C.muted} style={styles.input} autoCapitalize="words" /> : null}
          <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor={C.muted} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={C.muted} style={styles.input} secureTextEntry />
          <Button title={authMode === 'login' ? 'Log in  ♡' : 'Create my account  ✿'} onPress={handleAuth} style={{ marginTop: 8 }} />
          <Pressable onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={styles.authSwitch}>
            <Text style={styles.authSwitchText}>{authMode === 'login' ? 'New around here? ' : 'Already part of the club? '}<Text style={styles.authSwitchStrong}>{authMode === 'login' ? 'Sign up' : 'Log in'}</Text></Text>
          </Pressable>
          <Pressable onPress={() => { setUser({ name: 'Campus Buddy', email: 'hello@academia.mu' }); setScreen('home'); }} style={styles.guestLink}>
            <Text style={styles.guestLinkText}>Just browsing? Continue as guest →</Text>
          </Pressable>
        </View>
        <Text style={styles.demoNote}>Demo app · no real account or payment is created</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderHeader = (title = 'academia', subtitle = 'little things for big ideas') => (
    <View style={styles.topHeader}>
      <View style={styles.headerLeft}>
        <BrandMark small />
        <View><Text style={styles.headerBrand}>{title}</Text><Text style={styles.headerSubtitle}>{subtitle}</Text></View>
      </View>
      <Pressable onPress={() => navigate('profile')} style={styles.avatarButton}><Text style={styles.avatarButtonText}>{(user.name || 'A').trim().charAt(0).toUpperCase()}</Text></Pressable>
    </View>
  );

  const renderHome = () => (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        {renderHeader()}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}><Text style={styles.eyebrow}>YOUR LITTLE STUDY CORNER</Text><Text style={styles.greeting}>Hey, {user.name.split(' ')[0] || 'there'}! <Text style={{ color: C.deepPink }}>✿</Text></Text><Text style={styles.greetingSub}>Ready to romanticise your study routine?</Text></View>
          <Text style={styles.greetingDoodle}>♡</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}><Text style={styles.searchIcon}>🔍</Text><TextInput value={search} onChangeText={setSearch} placeholder="Find your next desk bestie..." placeholderTextColor="#A19BAD" style={styles.searchInput} returnKeyType="search" /></View>
          <Pressable onPress={openFilters} style={styles.filterButton}><Text style={styles.filterIcon}>≡</Text></Pressable>
        </View>
        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <View style={styles.heroTag}><Text style={styles.heroTagText}>THE STUDY EDIT ✦</Text></View>
            <Text style={styles.heroTitle}>Make space{ '\n' }for big ideas.</Text>
            <Text style={styles.heroText}>Cute stationery. Clear mind. Your kind of study day.</Text>
            <Pressable onPress={() => { setCategory('All Products'); setPriceRange('Any price'); setSearch(''); }} style={styles.heroButton}><Text style={styles.heroButtonText}>Explore the edit  →</Text></Pressable>
          </View>
          <View style={styles.heroArt}><Image source={require('./assets/products/comboset-001.jpeg')} style={styles.heroImage} resizeMode="contain" /><Text style={styles.heroStar}>✦</Text></View>
          <View style={styles.heroBubble} />
        </View>
        <View style={styles.sectionTitleRow}><View><Text style={styles.sectionTitle}>Shop by mood</Text><Text style={styles.sectionSubtitle}>A little category therapy</Text></View><Text style={styles.sectionDoodle}>♡</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {CATEGORIES.map((item) => <Pill key={item} title={item} active={category === item} onPress={() => setCategory(item)} />)}
        </ScrollView>
        <View style={styles.sectionTitleRow}><View><Text style={styles.sectionTitle}>{search || category !== 'All Products'|| priceRange !== 'Any price' ? 'Your little finds' : 'Desk besties'}</Text><Text style={styles.sectionSubtitle}>{filteredProducts.length} lovely {filteredProducts.length === 1 ? 'find' : 'finds'} for your pencil case</Text></View><Pressable onPress={openFilters}><Text style={styles.refineText}>Refine ✧</Text></Pressable></View>
        {filteredProducts.length ? <View style={styles.productGrid}>{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={() => { setSelectedProduct(product); setScreen('detail'); }} onAdd={() => addToCart(product)} favorite={favourites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} />)}</View> : <View style={styles.emptySearch}><Text style={styles.emptyEmoji}>🔎</Text><Text style={styles.emptyTitle}>No stationery found just yet</Text><Text style={styles.emptyText}>Try another search or give your filters a little reset.</Text><Button title="Clear the filters" variant="secondary" onPress={() => { setSearch(''); setCategory('All Products'); setPriceRange('Any price'); }} /></View>}
        <View style={styles.footerNote}><Text style={styles.footerNoteIcon}>✿</Text><Text style={styles.footerNoteText}>A gentle reminder: you’re doing better than you think.</Text></View>
      </ScrollView>
      <BottomNav active="home" onNavigate={navigate} cartCount={cartCount} />
    </>
  );

  const renderDetail = () => (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        <View style={styles.detailTopBar}><Pressable onPress={() => setScreen('home')} style={styles.backButton}><Text style={styles.backButtonText}>‹</Text></Pressable><Text style={styles.detailTopTitle}>A little something for you</Text><Pressable onPress={() => toggleFavorite(selectedProduct.id)} style={styles.detailHeart}><Text style={[styles.heartText, favourites.includes(selectedProduct.id) && { color: C.deepPink }]}>{favourites.includes(selectedProduct.id) ? '♥' : '♡'}</Text></Pressable></View>
        <View style={[styles.detailImagePanel, { backgroundColor: selectedProduct.color }]}><View style={styles.detailImageOrb} /><Image source={selectedProduct.image} style={styles.detailImage} resizeMode="contain" /><Text style={styles.detailSparkleOne}>✦</Text><Text style={styles.detailSparkleTwo}>✧</Text></View>
        <View style={styles.detailMetaRow}>
             <Text style={styles.detailCategory}>
                 {selectedProduct.category.toUpperCase()}
              </Text>
        </View>
        <Text style={styles.detailName}>{selectedProduct.name}</Text>
        <Text style={styles.detailPrice}>{money(selectedProduct.price)}</Text>
        <View style={styles.detailLabel}><Text style={styles.detailLabelText}>✿ {selectedProduct.label}</Text></View>
        <Text style={styles.detailDescription}>{selectedProduct.desc}</Text>
        <View style={styles.detailFeatureRow}><View style={styles.detailFeature}><Text style={styles.detailFeatureIcon}>♡</Text><Text style={styles.detailFeatureText}>Made for{ '\n' }everyday study</Text></View><View style={styles.detailFeature}><Text style={styles.detailFeatureIcon}>✦</Text><Text style={styles.detailFeatureText}>Cute desk{ '\n' }energy</Text></View><View style={styles.detailFeature}><Text style={styles.detailFeatureIcon}>✓</Text><Text style={styles.detailFeatureText}>Student{ '\n' }approved</Text></View></View>
        <Button title={`Add to my bag · ${money(selectedProduct.price)}`} onPress={() => addToCart(selectedProduct)} style={{ marginTop: 22 }} />
        <Button title="Keep browsing" variant="secondary" onPress={() => setScreen('home')} style={{ marginTop: 10 }} />
      </ScrollView>
      <BottomNav active="home" onNavigate={navigate} cartCount={cartCount} />
    </>
  );

  const renderCart = () => (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        {renderHeader('your bag', 'good things are on their way')}
        <View style={styles.cartHeadingRow}><View><Text style={styles.pageTitle}>The good stuff</Text><Text style={styles.pageSubtitle}>{cartCount} {cartCount === 1 ? 'item' : 'items'} tucked in your bag</Text></View><Text style={styles.cartHeadingHeart}>♡</Text></View>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}><View style={styles.emptyCartArt}><Text style={styles.emptyCartEmoji}>🛍️</Text><Text style={styles.emptyCartSparkle}>✦</Text></View><Text style={styles.emptyTitle}>Your bag is taking a nap</Text><Text style={styles.emptyText}>Let’s find something lovely for your next study session.</Text><Button title="Find my desk besties" onPress={() => setScreen('home')} style={{ marginTop: 20 }} /></View>
        ) : (
          <>
            <View style={styles.cartList}>{cartItems.map((item) => <View key={item.id} style={styles.cartItem}><Pressable onPress={() => { setSelectedProduct(item); setScreen('detail'); }} style={[styles.cartThumb, { backgroundColor: item.color }]}><Image source={item.image} style={styles.cartImage} resizeMode="contain" /></Pressable><View style={styles.cartItemInfo}><Text style={styles.productCategory}>{item.category.toUpperCase()}</Text><Text style={styles.cartItemName}>{item.name}</Text><Text style={styles.cartItemPrice}>{money(item.price)}</Text><View style={styles.quantityRow}><Pressable onPress={() => changeQuantity(item.id, -1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>−</Text></Pressable><Text style={styles.quantityText}>{item.quantity}</Text><Pressable onPress={() => changeQuantity(item.id, 1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>+</Text></Pressable><Pressable onPress={() => setCart((previous) => { const next = { ...previous }; delete next[item.id]; return next; })} style={styles.removeButton}><Text style={styles.removeButtonText}>Remove</Text></Pressable></View></View><Text style={styles.cartLineTotal}>{money(item.price * item.quantity)}</Text></View>)}</View>
            <View style={styles.deliveryNote}><Text style={styles.deliveryIcon}>✿</Text><View style={{ flex: 1 }}><Text style={styles.deliveryTitle}>{subtotal >= 500 ? 'Yay! Delivery is on us' : `You're ${money(500 - subtotal)} away from free delivery`}</Text><Text style={styles.deliveryText}>Free delivery on orders of Rs 500 and above.</Text></View></View>
            <View style={styles.summaryCard}><Text style={styles.summaryHeading}>Little order summary</Text><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{money(subtotal)}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={[styles.summaryValue, delivery === 0 && { color: C.green }]}>{delivery === 0 ? 'FREE' : money(delivery)}</Text></View><View style={styles.summaryDivider} /><View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{money(total)}</Text></View><Button title="Checkout preview  →" onPress={() => Alert.alert('Checkout preview ✿', `Your Academia order total is ${money(total)}. This coursework prototype does not process real payments.`)} style={{ marginTop: 16 }} /><Text style={styles.checkoutNote}>Secure checkout is a design preview only.</Text></View>
          </>
        )}
      </ScrollView>
      <BottomNav active="cart" onNavigate={navigate} cartCount={cartCount} />
    </>
  );

  const renderProfile = () => (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        {renderHeader('my little corner', 'your Academia account')}
        <View style={styles.profileHero}><View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{(user.name || 'A').trim().charAt(0).toUpperCase()}</Text><Text style={styles.profileAvatarFlower}>✿</Text></View><Text style={styles.profileName}>{user.name}</Text><Text style={styles.profileEmail}>{user.email}</Text><View style={styles.memberPill}><Text style={styles.memberPillText}>♡ THE ACADEMIA CLUB</Text></View></View>
        <View style={styles.profileSectionHeader}><Text style={styles.sectionTitle}>Your details</Text><Pressable onPress={() => setEditProfile((value) => !value)}><Text style={styles.refineText}>{editProfile ? 'Cancel' : 'Edit profile ✎'}</Text></Pressable></View>
        <View style={styles.profileCard}>
          <Text style={styles.fieldLabel}>FULL NAME</Text><TextInput editable={editProfile} value={user.name} onChangeText={(value) => setUser((previous) => ({ ...previous, name: value }))} style={[styles.profileInput, !editProfile && styles.profileInputDisabled]} placeholder="Your name" placeholderTextColor={C.muted} />
          <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text><TextInput editable={editProfile} value={user.email} onChangeText={(value) => setUser((previous) => ({ ...previous, email: value }))} style={[styles.profileInput, !editProfile && styles.profileInputDisabled]} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor={C.muted} />
          {editProfile ? <Button title="Save my details ✓" onPress={() => { if (!user.name.trim() || !/\S+@\S+\.\S+/.test(user.email)) { Alert.alert('Please check your details', 'A name and valid email are required.'); return; } setEditProfile(false); notify('Profile details saved ♡'); }} style={{ marginTop: 12 }} /> : null}
        </View>
        <View style={styles.profileStatsRow}><View style={styles.profileStat}><Text style={styles.profileStatNumber}>{favourites.length}</Text><Text style={styles.profileStatLabel}>Saved loves</Text></View><View style={styles.profileStatDivider} /><View style={styles.profileStat}><Text style={styles.profileStatNumber}>{cartCount}</Text><Text style={styles.profileStatLabel}>Bag items</Text></View><View style={styles.profileStatDivider} /><View style={styles.profileStat}><Text style={styles.profileStatNumber}>✿</Text><Text style={styles.profileStatLabel}>Study happy</Text></View></View>
        <View style={styles.profileTip}><Text style={styles.profileTipIcon}>✧</Text><View style={{ flex: 1 }}><Text style={styles.profileTipTitle}>A note just for you</Text><Text style={styles.profileTipText}>You do not have to do it all today. One page at a time.</Text></View></View>
        <Button title="Log out" variant="outline" onPress={() => { setPassword(''); setScreen('auth'); setAuthMode('login'); }} style={{ marginTop: 18 }} textStyle={{ color: C.deepPink }} />
        <Text style={styles.profileDisclaimer}>Academia demo · profile information is kept only in the current app session.</Text>
      </ScrollView>
      <BottomNav active="profile" onNavigate={navigate} cartCount={cartCount} />
    </>
  );

  const renderFilters = () => (
    <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
      <View style={styles.modalBackdrop}><Pressable style={StyleSheet.absoluteFill} onPress={() => setFilterOpen(false)} /><View style={styles.filterSheet}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Find your kind of cute</Text><Text style={styles.sheetSubtitle}>A few little filters to help</Text></View><Pressable onPress={() => setFilterOpen(false)} style={styles.sheetClose}><Text style={styles.sheetCloseText}>×</Text></Pressable></View>
        <Text style={styles.filterLabel}>CATEGORY</Text><View style={styles.filterChips}>{CATEGORIES.map((item) => <Pill key={item} title={item} active={filterDraft.category === item} onPress={() => setFilterDraft((p) => ({ ...p, category: item }))} />)}</View>
    
        <Text style={styles.filterLabel}>PRICE RANGE</Text><View style={styles.filterChips}>{PRICE_RANGES.map((item) => <Pill key={item} title={item} active={filterDraft.priceRange === item} onPress={() => setFilterDraft((p) => ({ ...p, priceRange: item }))} />)}</View>
        <View style={styles.filterActionRow}><Button title="Reset" variant="secondary" onPress={clearFilters} style={{ flex: 1 }} /><Button title="Show my finds" onPress={applyFilters} style={{ flex: 1 }} /></View>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.cream }, appBackground: { flex: 1, backgroundColor: C.cream }, screenFrame: { flex: 1 },
  brandMark: { width: 58, height: 58, borderRadius: 22, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }], shadowColor: '#D96D9C', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  brandMarkSmall: { width: 42, height: 42, borderRadius: 15 }, brandMarkText: { fontSize: 36, fontWeight: '900', color: C.white, lineHeight: 40 }, brandMarkTextSmall: { fontSize: 26, lineHeight: 31 },
  button: { minHeight: 52, borderRadius: 17, paddingHorizontal: 18, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  button_primary: { backgroundColor: C.ink, shadowColor: C.ink, shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  button_secondary: { backgroundColor: C.blush, borderWidth: 1, borderColor: '#F8D8E6' }, button_outline: { backgroundColor: C.white, borderWidth: 1.5, borderColor: '#F1C1D5' },
  buttonText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.15 }, buttonText_primary: { color: C.white }, buttonText_secondary: { color: C.deepPink }, buttonText_outline: { color: C.deepPink },
  authScreen: { flex: 1 }, authScroll: { paddingHorizontal: 26, paddingTop: 28, paddingBottom: 28, alignItems: 'center' },
  authDecorTop: { width: '100%', height: 42, position: 'relative', marginBottom: 5 }, decorDotPink: { position: 'absolute', width: 25, height: 25, borderRadius: 15, backgroundColor: '#FBD4E4', left: 22, top: 0 }, decorDotBlue: { position: 'absolute', width: 17, height: 17, borderRadius: 10, backgroundColor: '#CDE8FF', right: 42, top: 12 }, decorSparkle: { position: 'absolute', right: 78, top: -3, fontSize: 25, color: C.lilac },
  authBrand: { fontSize: 33, fontWeight: '900', color: C.ink, marginTop: 11, letterSpacing: -1.1 }, authTagline: { marginTop: 3, color: C.muted, fontSize: 13, letterSpacing: 0.7 },
  authIllustration: { height: 168, width: 220, marginTop: 9, alignItems: 'center', justifyContent: 'center', position: 'relative' }, authProductArt: { width: 180, height: 168 }, authSticker: { position: 'absolute', bottom: 4, right: -3, backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 7, paddingHorizontal: 12, transform: [{ rotate: '5deg' }] }, authStickerText: { fontSize: 10, color: C.ink, fontWeight: '800' },
  authCard: { width: '100%', maxWidth: 440, backgroundColor: C.white, borderRadius: 26, padding: 22, borderWidth: 1, borderColor: '#F8E7EF', shadowColor: '#BBA1B2', shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, authHeading: { fontSize: 24, fontWeight: '900', color: C.ink, letterSpacing: -0.5 }, authSubheading: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 18 }, input: { height: 49, borderRadius: 14, backgroundColor: '#FFFAFC', borderColor: C.line, borderWidth: 1, paddingHorizontal: 14, color: C.ink, marginBottom: 10, fontSize: 13 },
  authSwitch: { alignItems: 'center', marginTop: 18 }, authSwitchText: { fontSize: 12, color: C.muted }, authSwitchStrong: { color: C.deepPink, fontWeight: '900' }, guestLink: { alignItems: 'center', marginTop: 17 }, guestLinkText: { fontSize: 12, color: C.lilac, fontWeight: '800' }, demoNote: { color: '#AAA3AF', fontSize: 10, marginTop: 18 },
  pageContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28, maxWidth: 760, width: '100%', alignSelf: 'center' }, topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, headerLeft: { flexDirection: 'row', gap: 11, alignItems: 'center' }, headerBrand: { fontSize: 20, fontWeight: '900', color: C.ink, letterSpacing: -0.5 }, headerSubtitle: { color: C.muted, fontSize: 10, marginTop: 1 }, avatarButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.lavender, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD4FF' }, avatarButtonText: { fontSize: 17, fontWeight: '900', color: C.lilac },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 17 }, eyebrow: { color: C.deepPink, fontSize: 9, fontWeight: '900', letterSpacing: 1.3 }, greeting: { color: C.ink, fontSize: 28, lineHeight: 35, fontWeight: '900', letterSpacing: -0.9, marginTop: 5 }, greetingSub: { color: C.muted, fontSize: 11, marginTop: 2 }, greetingDoodle: { fontSize: 48, color: C.pink, transform: [{ rotate: '12deg' }], marginRight: 6 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 20 }, searchBox: { flex: 1, height: 49, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }, searchIcon: { fontSize: 27, color: C.deepPink, marginRight: 8, marginTop: -4 }, searchInput: { flex: 1, paddingVertical: 0, fontSize: 12, color: C.ink }, filterButton: { width: 50, height: 49, borderRadius: 16, backgroundColor: C.lavender, alignItems: 'center', justifyContent: 'center' }, filterIcon: { color: C.lilac, fontSize: 24, fontWeight: '700' },
  heroCard: { minHeight: 202, backgroundColor: '#FCEAF2', borderRadius: 25, padding: 17, overflow: 'hidden', flexDirection: 'row', marginBottom: 27, position: 'relative', borderWidth: 1, borderColor: '#F8DDE9' }, heroCopy: { width: '59%', zIndex: 2 }, heroTag: { alignSelf: 'flex-start', backgroundColor: C.white, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }, heroTagText: { fontSize: 8, color: C.deepPink, fontWeight: '900', letterSpacing: 0.7 }, heroTitle: { fontSize: 24, lineHeight: 27, fontWeight: '900', color: C.ink, marginTop: 12, letterSpacing: -0.6 }, heroText: { fontSize: 10, lineHeight: 15, color: '#797183', marginTop: 7, maxWidth: 175 }, heroButton: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 11, backgroundColor: C.ink, marginTop: 12 }, heroButtonText: { fontSize: 9, fontWeight: '800', color: C.white }, heroArt: { flex: 1, minWidth: 110, alignItems: 'center', justifyContent: 'center', marginLeft: -8, zIndex: 1 }, heroImage: { height: 176, width: 150, transform: [{ rotate: '7deg' }] }, heroStar: { position: 'absolute', color: C.lilac, fontSize: 27, right: 2, top: 6 }, heroBubble: { position: 'absolute', right: -30, bottom: -55, width: 155, height: 155, borderRadius: 100, backgroundColor: '#F7D5E5' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, sectionTitle: { color: C.ink, fontSize: 18, fontWeight: '900', letterSpacing: -0.45 }, sectionSubtitle: { color: C.muted, fontSize: 10, marginTop: 3 }, sectionDoodle: { fontSize: 29, color: C.pink }, categoryList: { gap: 8, paddingBottom: 7, marginBottom: 22 }, pill: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, marginRight: 0 }, pillActive: { backgroundColor: C.ink, borderColor: C.ink }, pillText: { color: '#777386', fontSize: 10, fontWeight: '700' }, pillTextActive: { color: C.white }, refineText: { color: C.deepPink, fontSize: 11, fontWeight: '900' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 13 }, productCard: { width: '48.2%', borderRadius: 21, borderWidth: 1, borderColor: '#F2E8ED', backgroundColor: C.white, padding: 9, position: 'relative', minHeight: 243 }, productImageWrap: { height: 135, backgroundColor: '#FFF7FB', borderRadius: 15, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, productImage: { width: '100%', height: '100%' }, productLabel: { position: 'absolute', top: 7, left: 7, backgroundColor: C.white, borderRadius: 7, paddingHorizontal: 6, paddingVertical: 4, borderWidth: 1, borderColor: '#F6E7EE' }, productLabelText: { fontSize: 7, color: C.deepPink, fontWeight: '800' }, heartButton: { position: 'absolute', right: 15, top: 13, width: 26, height: 26, borderRadius: 13, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', zIndex: 2 }, heartText: { fontSize: 18, color: '#9E97A9', lineHeight: 21 }, productInfo: { paddingTop: 11, paddingBottom: 6, paddingRight: 3 }, productCategory: { fontSize: 8, fontWeight: '900', letterSpacing: 0.9, color: '#A19AAC' }, productName: { color: C.ink, fontSize: 12, lineHeight: 16, fontWeight: '800', marginTop: 4, minHeight: 31 }, productPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }, productPrice: { color: C.ink, fontSize: 12, fontWeight: '900' }, addMini: { position: 'absolute', bottom: 11, right: 10, backgroundColor: C.blush, height: 26, width: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, addMiniText: { color: C.deepPink, fontSize: 19, lineHeight: 22, fontWeight: '800' }, emptySearch: { padding: 26, backgroundColor: C.white, borderRadius: 22, alignItems: 'center', borderWidth: 1, borderColor: C.line }, emptyEmoji: { fontSize: 36, marginBottom: 10 }, emptyTitle: { fontSize: 17, fontWeight: '900', color: C.ink, textAlign: 'center' }, emptyText: { fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 18, marginTop: 8, marginBottom: 15 }, footerNote: { marginTop: 24, borderRadius: 15, backgroundColor: '#F4F0FF', padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' }, footerNoteIcon: { fontSize: 21, color: C.lilac }, footerNoteText: { flex: 1, fontSize: 10, color: '#77708F', fontWeight: '700' },
  bottomNav: { minHeight: 70, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#F1E7ED', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: Platform.OS === 'ios' ? 4 : 2, paddingTop: 7 }, navItem: { alignItems: 'center', justifyContent: 'center', width: '33.3%' }, navIconWrap: { width: 37, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' }, navIconWrapActive: { backgroundColor: C.blush }, navIcon: { fontSize: 21, color: '#A5A0B0', lineHeight: 25 }, navIconActive: { color: C.deepPink }, navLabel: { color: '#A5A0B0', fontSize: 9, marginTop: 2, fontWeight: '700' }, navLabelActive: { color: C.deepPink, fontWeight: '900' }, navBadge: { position: 'absolute', right: -3, top: -3, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: C.deepPink, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.white }, navBadgeText: { color: C.white, fontSize: 8, fontWeight: '900' },
  detailTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, backButton: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }, backButtonText: { fontSize: 32, color: C.ink, marginTop: -6 }, detailTopTitle: { color: C.ink, fontWeight: '800', fontSize: 13 }, detailHeart: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.blush, alignItems: 'center', justifyContent: 'center' }, detailImagePanel: { height: 290, borderRadius: 26, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }, detailImageOrb: { position: 'absolute', width: 210, height: 210, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.55)' }, detailImage: { width: '95%', height: '95%', zIndex: 1 }, detailSparkleOne: { position: 'absolute', top: 23, right: 26, color: C.white, fontSize: 28 }, detailSparkleTwo: { position: 'absolute', bottom: 28, left: 27, color: C.white, fontSize: 30 }, detailMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21, gap: 9 }, detailCategory: { color: C.deepPink, fontSize: 9, fontWeight: '900', letterSpacing: 0.9, flex: 1 }, detailName: { color: C.ink, fontSize: 26, fontWeight: '900', letterSpacing: -0.8, marginTop: 8 }, detailPrice: { color: C.deepPink, fontSize: 20, fontWeight: '900', marginTop: 5 }, detailLabel: { alignSelf: 'flex-start', marginTop: 12, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: C.mint }, detailLabelText: { color: '#468D76', fontSize: 10, fontWeight: '900' }, detailDescription: { fontSize: 12, lineHeight: 20, color: '#787487', marginTop: 14 }, detailFeatureRow: { flexDirection: 'row', gap: 8, marginTop: 20 }, detailFeature: { flex: 1, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 15, alignItems: 'center', paddingVertical: 13 }, detailFeatureIcon: { color: C.deepPink, fontSize: 19, marginBottom: 6 }, detailFeatureText: { color: '#777386', textAlign: 'center', fontWeight: '700', fontSize: 9, lineHeight: 14 },
  cartHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }, pageTitle: { color: C.ink, fontSize: 27, fontWeight: '900', letterSpacing: -0.8 }, pageSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 }, cartHeadingHeart: { color: C.pink, fontSize: 42, transform: [{ rotate: '12deg' }] }, emptyCart: { paddingVertical: 42, paddingHorizontal: 22, alignItems: 'center', backgroundColor: C.white, borderRadius: 25, borderWidth: 1, borderColor: C.line, marginTop: 8 }, emptyCartArt: { width: 134, height: 134, borderRadius: 45, backgroundColor: C.blush, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }], marginBottom: 23, position: 'relative' }, emptyCartEmoji: { fontSize: 54 }, emptyCartSparkle: { position: 'absolute', color: C.lilac, fontSize: 24, right: 9, top: 7 }, cartList: { gap: 12 }, cartItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, padding: 10, gap: 10 }, cartThumb: { width: 88, height: 98, borderRadius: 15, overflow: 'hidden' }, cartImage: { width: '100%', height: '100%' }, cartItemInfo: { flex: 1, paddingVertical: 3 }, cartItemName: { color: C.ink, fontSize: 12, fontWeight: '900', marginTop: 4 }, cartItemPrice: { color: C.deepPink, fontWeight: '900', fontSize: 11, marginTop: 5 }, quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 }, quantityButton: { width: 25, height: 25, borderRadius: 8, backgroundColor: C.blush, alignItems: 'center', justifyContent: 'center' }, quantityButtonText: { color: C.deepPink, fontSize: 16, fontWeight: '900', lineHeight: 18 }, quantityText: { color: C.ink, fontSize: 11, fontWeight: '900', minWidth: 8, textAlign: 'center' }, removeButton: { marginLeft: 'auto' }, removeButtonText: { color: '#A7A1B0', fontSize: 9, fontWeight: '800' }, cartLineTotal: { color: C.ink, fontSize: 10, fontWeight: '900', alignSelf: 'flex-start', marginTop: 5 }, deliveryNote: { marginTop: 17, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.mint, padding: 14, borderRadius: 17 }, deliveryIcon: { color: C.green, fontSize: 23 }, deliveryTitle: { color: '#3F826C', fontSize: 11, fontWeight: '900' }, deliveryText: { color: '#649886', fontSize: 9, marginTop: 3 }, summaryCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 22, padding: 18, marginTop: 16 }, summaryHeading: { color: C.ink, fontSize: 15, fontWeight: '900', marginBottom: 16 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }, summaryLabel: { color: C.muted, fontSize: 11 }, summaryValue: { color: C.ink, fontSize: 11, fontWeight: '800' }, summaryDivider: { height: 1, backgroundColor: C.line, marginVertical: 4 }, totalLabel: { color: C.ink, fontSize: 14, fontWeight: '900' }, totalValue: { color: C.deepPink, fontSize: 19, fontWeight: '900' }, checkoutNote: { textAlign: 'center', marginTop: 10, color: '#AAA3AF', fontSize: 9 },
  profileHero: { backgroundColor: '#FCEAF2', borderRadius: 24, alignItems: 'center', paddingVertical: 25, paddingHorizontal: 18, borderWidth: 1, borderColor: '#F8DDE9' }, profileAvatar: { width: 83, height: 83, borderRadius: 30, backgroundColor: C.white, borderWidth: 4, borderColor: '#F7D4E3', alignItems: 'center', justifyContent: 'center', position: 'relative' }, profileAvatarText: { fontSize: 32, color: C.deepPink, fontWeight: '900' }, profileAvatarFlower: { position: 'absolute', right: -8, bottom: -4, color: C.lilac, fontSize: 22 }, profileName: { fontSize: 22, fontWeight: '900', color: C.ink, marginTop: 13 }, profileEmail: { fontSize: 11, color: C.muted, marginTop: 4 }, memberPill: { backgroundColor: C.white, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 7, marginTop: 13 }, memberPillText: { color: C.deepPink, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 }, profileSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }, profileCard: { backgroundColor: C.white, borderRadius: 21, borderWidth: 1, borderColor: C.line, padding: 17 }, fieldLabel: { color: '#A19AAC', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 6 }, profileInput: { height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#F0E7ED', paddingHorizontal: 12, color: C.ink, fontSize: 12, fontWeight: '700', marginBottom: 14, backgroundColor: '#FFFCFD' }, profileInputDisabled: { backgroundColor: '#FAF8FA', color: '#716D80' }, profileStatsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: C.white, borderRadius: 19, borderWidth: 1, borderColor: C.line, marginTop: 15, paddingVertical: 17 }, profileStat: { flex: 1, alignItems: 'center' }, profileStatNumber: { color: C.deepPink, fontSize: 21, fontWeight: '900' }, profileStatLabel: { color: C.muted, fontSize: 9, marginTop: 4 }, profileStatDivider: { width: 1, height: 35, backgroundColor: C.line }, profileTip: { flexDirection: 'row', gap: 11, backgroundColor: C.lavender, borderRadius: 17, padding: 14, marginTop: 15, alignItems: 'center' }, profileTipIcon: { fontSize: 25, color: C.lilac }, profileTipTitle: { color: '#675D9A', fontSize: 11, fontWeight: '900' }, profileTipText: { color: '#827AA9', fontSize: 10, lineHeight: 15, marginTop: 3 }, profileDisclaimer: { color: '#AAA3AF', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 15 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(50,42,62,0.35)', justifyContent: 'flex-end' }, filterSheet: { backgroundColor: C.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28, maxHeight: '88%', borderWidth: 1, borderColor: '#F5E3EC' }, sheetHandle: { width: 42, height: 5, borderRadius: 5, backgroundColor: '#E3D8E1', alignSelf: 'center', marginBottom: 19 }, sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }, sheetTitle: { fontSize: 21, color: C.ink, fontWeight: '900', letterSpacing: -0.5 }, sheetSubtitle: { fontSize: 10, color: C.muted, marginTop: 4 }, sheetClose: { width: 34, height: 34, borderRadius: 12, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }, sheetCloseText: { color: C.ink, fontSize: 25, lineHeight: 28 }, filterLabel: { color: C.deepPink, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginBottom: 9, marginTop: 5 }, filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 13 }, filterActionRow: { flexDirection: 'row', gap: 10, marginTop: 6 }, toast: { position: 'absolute', bottom: 83, left: 20, right: 20, alignSelf: 'center', maxWidth: 520, backgroundColor: C.ink, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 6 }, toastText: { color: C.white, fontSize: 11, fontWeight: '800', textAlign: 'center' },
});

import React from 'react';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';
import BrandMark from '../components/BrandMark';
import Pill from '../components/Pill';
import ProductCard from '../components/ProductCard';

export default function HomeScreen({
  styles,
  user,
  screen,
  search,
  setSearch,
  category,
  setCategory,
  priceRange,
  setPriceRange,
  openFilters,
  setSelectedProduct,
  setScreen,
  addToCart,
  toggleFavorite,
  favourites,
  filteredProducts,
  cartCount,
  navigate,
}) {
  const renderHeader = (title = 'academia', subtitle = 'little things for big ideas') => (
    <View style={styles.topHeader}>
      <View style={styles.headerLeft}>
        <BrandMark small styles={styles} />
        <View><Text style={styles.headerBrand}>{title}</Text><Text style={styles.headerSubtitle}>{subtitle}</Text></View>
      </View>
      <Pressable onPress={() => navigate('profile')} style={styles.avatarButton}><Text style={styles.avatarButtonText}>{(user.name || 'A').trim().charAt(0).toUpperCase()}</Text></Pressable>
    </View>
  );

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        {renderHeader()}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}><Text style={styles.eyebrow}>YOUR LITTLE STUDY CORNER</Text><Text style={styles.greeting}>Hey, {user.name.split(' ')[0] || 'there'}! <Text style={{ color: '#D96D9C' }}>✿</Text></Text><Text style={styles.greetingSub}>Ready to romanticise your study routine?</Text></View>
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
          <View style={styles.heroArt}><Text style={styles.heroImage}>📚</Text><Text style={styles.heroStar}>✦</Text></View>
          <View style={styles.heroBubble} />
        </View>
        <View style={styles.sectionTitleRow}><View><Text style={styles.sectionTitle}>Shop by mood</Text><Text style={styles.sectionSubtitle}>A little category therapy</Text></View><Text style={styles.sectionDoodle}>♡</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {['All Products', 'Paper & Planning', 'Everyday Essentials', 'Art Supplies'].map((item) => (
            <Pill key={item} title={item} active={category === item} onPress={() => setCategory(item)} styles={styles} />
          ))}
        </ScrollView>
        <View style={styles.sectionTitleRow}><View><Text style={styles.sectionTitle}>{search || category !== 'All Products' || priceRange !== 'Any price' ? 'Your little finds' : 'Desk besties'}</Text><Text style={styles.sectionSubtitle}>{filteredProducts.length} lovely {filteredProducts.length === 1 ? 'find' : 'finds'} for your pencil case</Text></View><Pressable onPress={openFilters}><Text style={styles.refineText}>Refine ✧</Text></Pressable></View>
        {filteredProducts.length ? (
          <View style={styles.productGrid}>{filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => {
                setSelectedProduct(product);
                setScreen('detail');
              }}
              onAdd={() => addToCart(product)}
              favorite={favourites.includes(product.id)}
              onFavorite={() => toggleFavorite(product.id)}
              styles={styles}
            />
          ))}</View>
        ) : (
          <View style={styles.emptySearch}><Text style={styles.emptyEmoji}>🔎</Text><Text style={styles.emptyTitle}>No stationery found just yet</Text><Text style={styles.emptyText}>Try another search or give your filters a little reset.</Text><Button title="Clear the filters" variant="secondary" onPress={() => { setSearch(''); setCategory('All Products'); setPriceRange('Any price'); }} styles={styles} /></View>
        )}
        <View style={styles.footerNote}><Text style={styles.footerNoteIcon}>✿</Text><Text style={styles.footerNoteText}>A gentle reminder: you’re doing better than you think.</Text></View>
      </ScrollView>
      <BottomNav active="home" onNavigate={navigate} cartCount={cartCount} styles={styles} />
    </>
  );
}

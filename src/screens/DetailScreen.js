import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';

export default function DetailScreen({
  styles,
  selectedProduct,
  favourites,
  toggleFavorite,
  addToCart,
  setScreen,
  cartCount,
  navigate,
  money,
}) {
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        <View style={styles.detailTopBar}>
          <Pressable onPress={() => setScreen('home')} style={styles.backButton}><Text style={styles.backButtonText}>‹</Text></Pressable>
          <Text style={styles.detailTopTitle}>A little something for you</Text>
          <Pressable onPress={() => toggleFavorite(selectedProduct.id)} style={styles.detailHeart}><Text style={[styles.heartText, favourites.includes(selectedProduct.id) && { color: '#D96D9C' }]}>{favourites.includes(selectedProduct.id) ? '♥' : '♡'}</Text></Pressable>
        </View>
        <View style={[styles.detailImagePanel, { backgroundColor: selectedProduct.color }]}>
          <View style={styles.detailImageOrb} />
          <Text style={styles.detailImage}>📘</Text>
          <Text style={styles.detailSparkleOne}>✦</Text>
          <Text style={styles.detailSparkleTwo}>✧</Text>
        </View>
        <View style={styles.detailMetaRow}><Text style={styles.detailCategory}>{selectedProduct.category.toUpperCase()}</Text></View>
        <Text style={styles.detailName}>{selectedProduct.name}</Text>
        <Text style={styles.detailPrice}>{money(selectedProduct.price)}</Text>
        <View style={styles.detailLabel}><Text style={styles.detailLabelText}>✿ {selectedProduct.label}</Text></View>
        <Text style={styles.detailDescription}>{selectedProduct.desc}</Text>
        <View style={styles.detailFeatureRow}>
          <View style={styles.detailFeature}><Text style={styles.detailFeatureIcon}>♡</Text><Text style={styles.detailFeatureText}>Made for{ '\n' }everyday study</Text></View>
          <View style={styles.detailFeature}><Text style={styles.detailFeatureIcon}>✦</Text><Text style={styles.detailFeatureText}>Cute desk{ '\n' }energy</Text></View>
          <View style={styles.detailFeature}><Text style={styles.detailFeatureIcon}>✓</Text><Text style={styles.detailFeatureText}>Student{ '\n' }approved</Text></View>
        </View>
        <Button title={`Add to my bag · ${money(selectedProduct.price)}`} onPress={() => addToCart(selectedProduct)} style={{ marginTop: 22 }} styles={styles} />
        <Button title="Keep browsing" variant="secondary" onPress={() => setScreen('home')} style={{ marginTop: 10 }} styles={styles} />
      </ScrollView>
      <BottomNav active="home" onNavigate={navigate} cartCount={cartCount} styles={styles} />
    </>
  );
}

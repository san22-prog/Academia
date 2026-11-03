import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import Button from '../components/Button';

export default function CartScreen({
  styles,
  cartItems,
  cartCount,
  subtotal,
  delivery,
  total,
  money,
  changeQuantity,
  setCart,
  setSelectedProduct,
  setScreen,
  navigate,
}) {
  const renderHeader = () => (
    <View style={styles.topHeader}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerBrand}>your bag</Text>
      </View>
      <Pressable onPress={() => navigate('profile')} style={styles.avatarButton}><Text style={styles.avatarButtonText}>A</Text></Pressable>
    </View>
  );

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        {renderHeader()}
        <View style={styles.cartHeadingRow}><View><Text style={styles.pageTitle}>The good stuff</Text><Text style={styles.pageSubtitle}>{cartCount} {cartCount === 1 ? 'item' : 'items'} tucked in your bag</Text></View><Text style={styles.cartHeadingHeart}>♡</Text></View>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}><View style={styles.emptyCartArt}><Text style={styles.emptyCartEmoji}>🛍️</Text><Text style={styles.emptyCartSparkle}>✦</Text></View><Text style={styles.emptyTitle}>Your bag is taking a nap</Text><Text style={styles.emptyText}>Let’s find something lovely for your next study session.</Text><Button title="Find my desk besties" onPress={() => setScreen('home')} style={{ marginTop: 20 }} styles={styles} /></View>
        ) : (
          <>
            <View style={styles.cartList}>{cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Pressable onPress={() => { setSelectedProduct(item); setScreen('detail'); }} style={[styles.cartThumb, { backgroundColor: item.color }]}><Text style={styles.cartImage}>📘</Text></Pressable>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>{money(item.price)}</Text>
                  <View style={styles.quantityRow}>
                    <Pressable onPress={() => changeQuantity(item.id, -1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>−</Text></Pressable>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <Pressable onPress={() => changeQuantity(item.id, 1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>+</Text></Pressable>
                    <Pressable onPress={() => setCart((previous) => { const next = { ...previous }; delete next[item.id]; return next; })} style={styles.removeButton}><Text style={styles.removeButtonText}>Remove</Text></Pressable>
                  </View>
                </View>
                <Text style={styles.cartLineTotal}>{money(item.price * item.quantity)}</Text>
              </View>
            ))}</View>
            <View style={styles.deliveryNote}><Text style={styles.deliveryIcon}>✿</Text><View style={{ flex: 1 }}><Text style={styles.deliveryTitle}>{subtotal >= 500 ? 'Yay! Delivery is on us' : `You're ${money(500 - subtotal)} away from free delivery`}</Text><Text style={styles.deliveryText}>Free delivery on orders of Rs 500 and above.</Text></View></View>
            <View style={styles.summaryCard}><Text style={styles.summaryHeading}>Little order summary</Text><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{money(subtotal)}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={[styles.summaryValue, delivery === 0 && { color: '#63B99B' }]}>{delivery === 0 ? 'FREE' : money(delivery)}</Text></View><View style={styles.summaryDivider} /><View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{money(total)}</Text></View><Button title="Checkout preview  →" onPress={() => alert('Checkout preview')} style={{ marginTop: 16 }} styles={styles} /><Text style={styles.checkoutNote}>Secure checkout is a design preview only.</Text></View>
          </>
        )}
      </ScrollView>
    </>
  );
}

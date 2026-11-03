import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, Image, Pressable } from 'react-native';
import Button from '../components/Button';
import BrandMark from '../components/BrandMark';

export default function AuthScreen({
  styles,
  authMode,
  setAuthMode,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth,
  setUser,
  setScreen,
}) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.authScreen}>
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.authDecorTop}><View style={styles.decorDotPink} /><View style={styles.decorDotBlue} /><Text style={styles.decorSparkle}>✦</Text></View>
        <BrandMark styles={styles} />
        <Text style={styles.authBrand}>academia</Text>
        <Text style={styles.authTagline}>little things for big ideas</Text>
        <View style={styles.authIllustration}>
          <Image source={require('../../assets/products/cloud-notebook.png')} style={styles.authProductArt} resizeMode="contain" />
          <View style={styles.authSticker}><Text style={styles.authStickerText}>✿ study happy ✿</Text></View>
        </View>
        <View style={styles.authCard}>
          <Text style={styles.authHeading}>{authMode === 'login' ? 'Welcome back!' : 'Let’s make it official'}</Text>
          <Text style={styles.authSubheading}>{authMode === 'login' ? 'Your next favourite study essential awaits.' : 'Create an account for your stationery wishlist.'}</Text>
          {authMode === 'signup' ? <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#89869B" style={styles.input} autoCapitalize="words" /> : null}
          <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#89869B" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#89869B" style={styles.input} secureTextEntry />
          <Button title={authMode === 'login' ? 'Log in  ♡' : 'Create my account  ✿'} onPress={handleAuth} style={{ marginTop: 8 }} styles={styles} />
          <Pressable onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={styles.authSwitch}>
            <Text style={styles.authSwitchText}>{authMode === 'login' ? 'New around here? ' : 'Already part of the club? '}<Text style={styles.authSwitchStrong}>{authMode === 'login' ? 'Sign up' : 'Log in'}</Text></Text>
          </Pressable>
          <Pressable onPress={() => {
            setUser({ name: 'Campus Buddy', email: 'hello@academia.mu' });
            setScreen('home');
          }} style={styles.guestLink}>
            <Text style={styles.guestLinkText}>Just browsing? Continue as guest →</Text>
          </Pressable>
        </View>
        <Text style={styles.demoNote}>Demo app · no real account or payment is created</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

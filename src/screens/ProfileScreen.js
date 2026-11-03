import React from 'react';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';

export default function ProfileScreen({
  styles,
  user,
  setUser,
  favourites,
  cartCount,
  editProfile,
  setEditProfile,
  notify,
  setPassword,
  setScreen,
  setAuthMode,
  navigate,
}) {
  const renderHeader = () => (
    <View style={styles.topHeader}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerBrand}>my little corner</Text>
      </View>
      <Pressable onPress={() => navigate('profile')} style={styles.avatarButton}><Text style={styles.avatarButtonText}>{(user.name || 'A').trim().charAt(0).toUpperCase()}</Text></Pressable>
    </View>
  );

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        {renderHeader()}
        <View style={styles.profileHero}><View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{(user.name || 'A').trim().charAt(0).toUpperCase()}</Text><Text style={styles.profileAvatarFlower}>✿</Text></View><Text style={styles.profileName}>{user.name}</Text><Text style={styles.profileEmail}>{user.email}</Text><View style={styles.memberPill}><Text style={styles.memberPillText}>♡ THE ACADEMIA CLUB</Text></View></View>
        <View style={styles.profileSectionHeader}><Text style={styles.sectionTitle}>Your details</Text><Pressable onPress={() => setEditProfile((value) => !value)}><Text style={styles.refineText}>{editProfile ? 'Cancel' : 'Edit profile ✎'}</Text></Pressable></View>
        <View style={styles.profileCard}>
          <Text style={styles.fieldLabel}>FULL NAME</Text><TextInput editable={editProfile} value={user.name} onChangeText={(value) => setUser((previous) => ({ ...previous, name: value }))} style={[styles.profileInput, !editProfile && styles.profileInputDisabled]} placeholder="Your name" placeholderTextColor="#89869B" />
          <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text><TextInput editable={editProfile} value={user.email} onChangeText={(value) => setUser((previous) => ({ ...previous, email: value }))} style={[styles.profileInput, !editProfile && styles.profileInputDisabled]} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor="#89869B" />
          {editProfile ? <Button title="Save my details ✓" onPress={() => {
            if (!user.name.trim() || !/\S+@\S+\.\S+/.test(user.email)) {
              alert('Please check your details');
              return;
            }
            setEditProfile(false);
            notify('Profile details saved ♡');
          }} style={{ marginTop: 12 }} styles={styles} /> : null}
        </View>
        <View style={styles.profileStatsRow}><View style={styles.profileStat}><Text style={styles.profileStatNumber}>{favourites.length}</Text><Text style={styles.profileStatLabel}>Saved loves</Text></View><View style={styles.profileStatDivider} /><View style={styles.profileStat}><Text style={styles.profileStatNumber}>{cartCount}</Text><Text style={styles.profileStatLabel}>Bag items</Text></View><View style={styles.profileStatDivider} /><View style={styles.profileStat}><Text style={styles.profileStatNumber}>✿</Text><Text style={styles.profileStatLabel}>Study happy</Text></View></View>
        <View style={styles.profileTip}><Text style={styles.profileTipIcon}>✧</Text><View style={{ flex: 1 }}><Text style={styles.profileTipTitle}>A note just for you</Text><Text style={styles.profileTipText}>You do not have to do it all today. One page at a time.</Text></View></View>
        <Button title="Log out" variant="outline" onPress={() => { setPassword(''); setScreen('auth'); setAuthMode('login'); }} style={{ marginTop: 18 }} textStyle={{ color: '#D96D9C' }} styles={styles} />
        <Text style={styles.profileDisclaimer}>Academia demo · profile information is kept only in the current app session.</Text>
      </ScrollView>
      <BottomNav active="profile" onNavigate={navigate} cartCount={cartCount} styles={styles} />
    </>
  );
}

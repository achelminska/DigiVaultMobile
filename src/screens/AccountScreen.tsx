import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../hooks/useCurrentUser';
import NotificationBell from '../components/NotificationBell';
import CartIconButton from '../components/CartIconButton';
import { AccountScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

interface MenuRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuRow({ icon, label, onPress, danger = false }: MenuRowProps) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuRowLeft}>
        <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
          <AntDesignIcon name={icon} size={18} color={danger ? '#FF4444' : colors.textPrimary} />
        </View>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      </View>
      {!danger && (
        <AntDesignIcon name="right" size={14} color={colors.textFaint} />
      )}
    </TouchableOpacity>
  );
}


export default function AccountScreen({ navigation }: AccountScreenProps) {
  const { firstName, lastName } = useCurrentUser();
  const queryClient = useQueryClient();

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || '—';

  const handleLogout = () => {
    Alert.alert(
      'Wyloguj się',
      'Czy na pewno chcesz się wylogować?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Wyloguj',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            queryClient.clear();
            navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Konto</Text>
          <Text style={styles.userName}>{fullName}</Text>
        </View>
        <View style={styles.headerActions}>
          <NotificationBell onPress={() => navigation.navigate('Notifications')} />
          <CartIconButton onPress={() => navigation.navigate('Cart')} />
        </View>
      </View>

      <View style={styles.menuSection}>
        <MenuRow
          icon="idcard"
          label="Dane konta"
          onPress={() => navigation.navigate('UserProfile')}
        />
        <View style={styles.separator} />
        <MenuRow
          icon="bells"
          label="Powiadomienia"
          onPress={() => navigation.navigate('Notifications')}
        />
        <View style={styles.separator} />
        <MenuRow
          icon="shoppingcart"
          label="Moje zamówienia"
          onPress={() => navigation.navigate('Orders')}
        />
        <View style={styles.separator} />
        <MenuRow
          icon="edit"
          label="Moje kursy"
          onPress={() => navigation.navigate('SellerDashboard')}
        />
      </View>

      <View style={[styles.menuSection, styles.menuSectionDanger]}>
        <MenuRow
          icon="logout"
          label="Wyloguj się"
          onPress={handleLogout}
          danger
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '400',
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuSectionDanger: {
    marginTop: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: {
    backgroundColor: 'rgba(255,68,68,0.12)',
  },
  menuLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: '#FF4444',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 66,
  },
});

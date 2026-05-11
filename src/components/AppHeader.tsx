import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NotificationBell from './NotificationBell';
import CartIconButton from './CartIconButton';
import { colors } from '../config/theme';

interface Props {
  title: string;
  subtitle?: string;
  label?: string;
  onNotificationsPress: () => void;
  onCartPress: () => void;
  paddingBottom?: number;
  alignItems?: 'center' | 'flex-start';
}

export default function AppHeader({
  title,
  subtitle,
  label,
  onNotificationsPress,
  onCartPress,
  paddingBottom = 20,
  alignItems = 'center',
}: Props) {
  return (
    <View style={[styles.header, { paddingBottom, alignItems }]}>
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.actions}>
        <NotificationBell onPress={onNotificationsPress} />
        <CartIconButton onPress={onCartPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  label: {
    color: colors.textLabel,
    fontSize: 14,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

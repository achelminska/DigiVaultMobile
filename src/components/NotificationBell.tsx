import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useNotifications } from '../hooks/useNotifications';
import { colors } from '../config/theme';

interface Props {
  onPress: () => void;
}

export default function NotificationBell({ onPress }: Props) {
  const { data: notifications = [] } = useNotifications();
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <AntDesignIcon name="bells" size={24} color={colors.textPrimary} />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
});

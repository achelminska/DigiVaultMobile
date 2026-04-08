import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useMarkAsRead } from '../hooks/useNotifications';
import { NotificationDetailScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

export default function NotificationDetailScreen({ route, navigation }: NotificationDetailScreenProps) {
  const { notification } = route.params;
  const { mutate: markAsRead } = useMarkAsRead();

  useEffect(() => {
    if (!notification.isRead) {
      markAsRead(notification.idNotification);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Powiadomienie</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.meta}>
          <View style={[styles.dot, notification.isRead ? styles.dotRead : styles.dotUnread]} />
          <Text style={styles.date}>
            {new Date(notification.createdAt).toLocaleDateString('pl-PL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <Text style={styles.title}>{notification.title}</Text>

        <View style={styles.divider} />

        <Text style={styles.message}>{notification.message}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 20 : 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 60,
    flexGrow: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotUnread: {
    backgroundColor: colors.white,
  },
  dotRead: {
    backgroundColor: colors.textSubtle,
  },
  date: {
    color: colors.textFaint,
    fontSize: 13,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 20,
  },
  message: {
    color: colors.textBody,
    fontSize: 15,
    lineHeight: 24,
  },
});

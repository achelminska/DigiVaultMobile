import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useOrderDetail } from '../hooks/useOrders';
import { OrderDetailScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailScreen({ navigation, route }: OrderDetailScreenProps) {
  const { idOrder } = route.params;
  const { data: order, isLoading, isError, refetch } = useOrderDetail(idOrder);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesignIcon name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Order #{idOrder}</Text>
        <View style={styles.backBtn} />
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <AntDesignIcon name="exclamationcircleo" size={48} color={colors.textFaint} />
          <Text style={styles.errorText}>Failed to load order</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {order && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order date</Text>
              <Text style={styles.summaryValue}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Courses</Text>
              <Text style={styles.summaryValue}>{order.itemsCount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.totalPrice}>{order.totalPrice.toFixed(2)} PLN</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Purchased courses</Text>

          <View style={styles.itemsList}>
            {order.orderItems.map((item, index) => (
              <React.Fragment key={item.idCourse}>
                <TouchableOpacity
                  style={styles.courseRow}
                  onPress={() => navigation.navigate('CourseDetail', { idCourse: item.idCourse })}
                  activeOpacity={0.7}>
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.coursePrice}>{item.price.toFixed(2)} PLN</Text>
                  </View>
                  <AntDesignIcon name="right" size={14} color={colors.textFaint} />
                </TouchableOpacity>
                {index < order.orderItems.length - 1 && (
                  <View style={styles.itemDivider} />
                )}
              </React.Fragment>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  retryText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  totalPrice: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  itemsList: {
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  courseInfo: {
    flex: 1,
    gap: 4,
  },
  courseTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  coursePrice: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
});

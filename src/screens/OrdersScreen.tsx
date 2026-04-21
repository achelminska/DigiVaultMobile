import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useOrders } from '../hooks/useOrders';
import { OrderSummary } from '../types/order';
import { OrdersScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface OrderCardProps {
  order: OrderSummary;
  onPress: () => void;
}

function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text style={styles.orderId}>Order #{order.idOrder}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
          <Text style={styles.itemsCount}>
            {order.itemsCount} {order.itemsCount === 1 ? 'course' : 'courses'}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.orderPrice}>{order.totalPrice.toFixed(2)} PLN</Text>
          <AntDesignIcon name="right" size={14} color={colors.textFaint} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const { data: orders = [], isLoading, isError, refetch } = useOrders();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesignIcon name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>My orders</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <AntDesignIcon name="exclamationcircleo" size={48} color={colors.textFaint} />
          <Text style={styles.emptyText}>Failed to load orders</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <View style={styles.centered}>
          <AntDesignIcon name="shoppingcart" size={64} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Your future purchases will appear here</Text>
        </View>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <FlatList
          data={orders}
          keyExtractor={item => String(item.idOrder)}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { idOrder: item.idOrder })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: Platform.OS === 'android' ? 20 : 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
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
    height: 36,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  cardLeft: {
    flex: 1,
    gap: 4,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  orderId: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  orderDate: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  itemsCount: {
    color: colors.textFaint,
    fontSize: 12,
  },
  orderPrice: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});

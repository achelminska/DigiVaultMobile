import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useCart, useRemoveFromCart, useCheckout } from '../hooks/useCart';
import { Course } from '../types/course';
import { CartScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

export default function CartScreen({ navigation }: CartScreenProps) {
  const { data: courses = [], isLoading, isError, refetch } = useCart();
  const removeFromCart = useRemoveFromCart();
  const checkout = useCheckout();

  const total = courses.reduce((sum, c) => sum + c.price, 0);

  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', { idCourse: course.idCourse });
  };

  const handleRemove = (courseId: number) => {
    removeFromCart.mutate(courseId);
  };

  const handleCheckout = () => {
    checkout.mutate(undefined, {
      onSuccess: (order) => {
        navigation.replace('OrderDetail', { idOrder: order.idOrder });
      },
      onError: () => {
        Alert.alert('Error', 'Failed to place the order. Please try again.');
      },
    });
  };

  const renderItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleCoursePress(item)}
      activeOpacity={0.75}>

      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <AntDesignIcon name="playcircleo" size={24} color={colors.iconFaint} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{item.authorName}</Text>
        <View style={styles.ratingRow}>
          <AntDesignIcon name="star" size={11} color={colors.textPrimary} />
          <Text style={styles.ratingValue}>
            {item.averageRating > 0 ? item.averageRating.toFixed(1) : '—'}
          </Text>
          {item.ratingsCount > 0 && (
            <Text style={styles.ratingCount}>({item.ratingsCount})</Text>
          )}
        </View>
        <Text style={styles.price}>{item.price.toFixed(2)} PLN</Text>
      </View>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemove(item.idCourse)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <AntDesignIcon name="delete" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Cart</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading && (
        <ActivityIndicator color={colors.textPrimary} style={styles.loader} />
      )}

      {isError && (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Something went wrong.</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && courses.length === 0 && (
        <View style={styles.emptyWrap}>
          <AntDesignIcon name="shoppingcart" size={42} color={colors.iconFaint} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Add courses you'd like to purchase</Text>
        </View>
      )}

      {!isLoading && !isError && courses.length > 0 && (
        <FlatList
          data={courses}
          keyExtractor={item => item.idCourse.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.countLabel}>
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </Text>
          }
          ListFooterComponent={<View style={{ height: 32 }} />}
        />
      )}

      {!isLoading && !isError && courses.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} PLN</Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutBtn, checkout.isPending && styles.checkoutBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleCheckout}
            disabled={checkout.isPending}>
            {checkout.isPending ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <Text style={styles.checkoutText}>Checkout</Text>
            )}
          </TouchableOpacity>
        </View>
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
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  countLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  thumbnailPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: colors.imagePlaceholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  author: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingCount: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  removeBtn: {
    paddingHorizontal: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
  },
  loader: {
    marginTop: 60,
  },
  errorWrap: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 60,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  totalValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  checkoutBtn: {
    backgroundColor: colors.textPrimary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutBtnDisabled: {
    opacity: 0.6,
  },
  checkoutText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
});

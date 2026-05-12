import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AppHeader from '../components/AppHeader';
import QueryState from '../components/QueryState';
import EmptyState from '../components/EmptyState';
import { useWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { useCart, useAddToCart } from '../hooks/useCart';
import { usePurchasedCourses } from '../hooks/useCourses';
import { Course } from '../types/course';
import { WishlistScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

interface WishlistItemProps {
  item: Course;
  inCart: boolean;
  isPurchased: boolean;
  addingToCart: boolean;
  onPress: () => void;
  onAddToCart: () => void;
  onRemove: () => void;
}

function WishlistItem({ item, inCart, isPurchased, addingToCart, onPress, onAddToCart, onRemove }: WishlistItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
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

        <View style={styles.actions}>
          {isPurchased ? (
            <View style={styles.purchasedBadge}>
              <AntDesignIcon name="checkcircle" size={12} color="#4CAF50" />
              <Text style={styles.purchasedText}>Purchased</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.cartBtn, inCart && styles.cartBtnInCart]}
              onPress={onAddToCart}
              disabled={inCart || addingToCart}
              activeOpacity={0.7}>
              <AntDesignIcon
                name="shoppingcart"
                size={13}
                color={inCart ? colors.textFaint : colors.black}
              />
              <Text style={[styles.cartBtnText, inCart && styles.cartBtnTextInCart]}>
                {inCart ? 'In cart' : addingToCart ? '...' : 'Add to cart'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={onRemove}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <AntDesignIcon name="heart" size={20} color="#FF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function WishlistScreen({ navigation }: WishlistScreenProps) {
  const { data: courses = [], isLoading, isError, refetch } = useWishlist();
  const { data: cart = [] } = useCart();
  const { data: purchasedCourses = [] } = usePurchasedCourses();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { mutate: addToCart, isPending: addingToCart, variables: addingCourseId } = useAddToCart();

  return (
    <View style={styles.container}>
      <AppHeader
        title="Wishlist"
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch} />

      {!isLoading && !isError && courses.length === 0 && (
        <EmptyState
          icon="hearto"
          title="Your wishlist is empty"
          subtitle="Save courses you're interested in"
        />
      )}

      {!isLoading && !isError && courses.length > 0 && (
        <FlatList
          data={courses}
          keyExtractor={item => item.idCourse.toString()}
          renderItem={({ item }) => (
            <WishlistItem
              item={item}
              inCart={cart.some(c => c.idCourse === item.idCourse)}
              isPurchased={purchasedCourses.some(c => c.idCourse === item.idCourse)}
              addingToCart={addingToCart && addingCourseId === item.idCourse}
              onPress={() => navigation.navigate('CourseDetail', { idCourse: item.idCourse })}
              onAddToCart={() => addToCart(item.idCourse)}
              onRemove={() => removeFromWishlist(item.idCourse)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
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
    alignItems: 'flex-start',
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
  actions: {
    marginTop: 8,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cartBtnInCart: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartBtnText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
  },
  cartBtnTextInCart: {
    color: colors.textFaint,
  },
  purchasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  purchasedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  removeBtn: {
    paddingTop: 2,
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
});

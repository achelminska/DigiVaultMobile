import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '../hooks/useWishlist';
import { useCart, useAddToCart } from '../hooks/useCart';
import { usePurchasedCourses } from '../hooks/useCourses';
import { useReviews, useAddReview, useDeleteReview } from '../hooks/useReviews';
import { useAddReport } from '../hooks/useReport';
import { useCurrentUser } from '../hooks/useCurrentUser';
import StarRating from '../components/StarRating';
import StarPicker from '../components/StarPicker';
import ReportModal from '../components/ReportModal';
import { CourseDetailScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

export default function CourseDetailScreen({ route, navigation }: CourseDetailScreenProps) {
  const { idCourse } = route.params;
  const { data: course, isLoading, isError } = useCourseDetail(idCourse);

  const { data: wishlist = [] } = useWishlist();
  const wishlisted = wishlist.some(c => c.idCourse === idCourse);
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const { data: cart = [] } = useCart();
  const inCart = cart.some(c => c.idCourse === idCourse);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

  const { data: purchasedCourses = [] } = usePurchasedCourses();
  const isPurchased = purchasedCourses.some(c => c.idCourse === idCourse);

  const { data: reviews = [], isLoading: loadingReviews } = useReviews(idCourse);
  const { mutate: submitReview, isPending: submittingReview } = useAddReview(idCourse);
  const { mutate: removeReview, isPending: deletingReview } = useDeleteReview(idCourse);

  const { idUser, firstName, lastName } = useCurrentUser();

  const myReview = reviews.find(r =>
    (r.idUser !== undefined && r.idUser === idUser) ||
    r.authorName === `${firstName} ${lastName}`.trim() ||
    r.authorName === firstName
  );

  const [reviewRating, setReviewRating] = useState(myReview?.rating ?? 0);
  const [reviewComment, setReviewComment] = useState(myReview?.comment ?? '');

  useEffect(() => {
    if (myReview) {
      setReviewRating(myReview.rating);
      setReviewComment(myReview.comment);
    }
  }, [myReview?.idReview]);

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      Alert.alert('Error', 'Please select a rating (1–5 stars).');
      return;
    }
    if (!reviewComment.trim()) {
      Alert.alert('Error', 'Please write a comment for your review.');
      return;
    }
    if (!idUser) return;
    submitReview(
      { idUser, idCourse, rating: reviewRating, comment: reviewComment.trim() },
      {
        onSuccess: () => Alert.alert('Success', myReview ? 'Review updated.' : 'Review submitted.'),
        onError: () => Alert.alert('Error', 'Failed to save the review.'),
      }
    );
  };

  const handleDeleteReview = () => {
    Alert.alert('Delete review', 'Are you sure you want to delete your review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          removeReview(undefined, {
            onSuccess: () => {
              setReviewRating(0);
              setReviewComment('');
            },
            onError: () => Alert.alert('Error', 'Failed to delete the review.'),
          }),
      },
    ]);
  };

  const { mutate: submitReport, isPending: submittingReport } = useAddReport(idCourse);

  const [reportVisible, setReportVisible] = useState(false);

  const handleReport = (reason: string) => {
    submitReport(reason, {
      onSuccess: () => Alert.alert('Thank you', 'Your report has been submitted.'),
      onError: () => Alert.alert('Error', 'Could not submit the report. Please try again.'),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.white} size="large" />
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load course.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* HERO IMAGE */}
        <View style={styles.heroWrapper}>
          {course.imageUrl ? (
            <Image source={{ uri: course.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <AntDesignIcon name="playcircleo" size={60} color={colors.textSubtle} />
            </View>
          )}
          <TouchableOpacity style={styles.backOverlay} onPress={() => navigation.goBack()}>
            <AntDesignIcon name="arrowleft" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportOverlay} onPress={() => setReportVisible(true)}>
            <AntDesignIcon name="flag" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          <View style={styles.chipsRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{course.categoryName}</Text>
            </View>
            {isPurchased && (
              <View style={styles.purchasedChip}>
                <AntDesignIcon name="checkcircle" size={12} color="#4CAF50" />
                <Text style={styles.purchasedChipText}>Purchased</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.authorRow}>
            <AntDesignIcon name="user" size={14} color={colors.textSecondary} />
            <Text style={styles.authorText}>{course.authorName}</Text>
          </View>

          <View style={styles.ratingRow}>
            <StarRating rating={course.averageRating} />
            <Text style={styles.ratingValue}>
              {course.averageRating > 0 ? course.averageRating.toFixed(1) : '—'}
            </Text>
            <Text style={styles.ratingCount}>
              ({course.ratingsCount} {course.ratingsCount === 1 ? 'review' : 'reviews'})
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AntDesignIcon name="shoppingcart" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{course.salesCount} sold</Text>
            </View>
            <View style={styles.statItem}>
              <AntDesignIcon name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>
                {new Date(course.createdAt).toLocaleDateString('en-GB')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Reviews {reviews.length > 0 && <Text style={styles.reviewsCount}>({reviews.length})</Text>}
          </Text>

          {/* REVIEW FORM — only for purchased courses */}
          {isPurchased && (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormTitle}>
                {myReview ? 'Your review' : 'Add a review'}
              </Text>
              <StarPicker
                value={reviewRating}
                onChange={setReviewRating}
                disabled={submittingReview || deletingReview}
              />
              <TextInput
                style={styles.reviewInput}
                  placeholder="Write a comment..."
                placeholderTextColor={colors.textFaint}
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                numberOfLines={3}
                editable={!submittingReview && !deletingReview}
              />
              <View style={styles.reviewFormActions}>
                {myReview && (
                  <TouchableOpacity
                    style={styles.deleteReviewBtn}
                    onPress={handleDeleteReview}
                    disabled={deletingReview || submittingReview}
                  >
                    {deletingReview
                      ? <ActivityIndicator size="small" color={colors.textPrimary} />
                      : <AntDesignIcon name="delete" size={16} color="#F44336" />
                    }
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.submitReviewBtn, (submittingReview || deletingReview) && styles.submitReviewBtnDisabled]}
                  onPress={handleSubmitReview}
                  disabled={submittingReview || deletingReview}
                >
                  {submittingReview
                    ? <ActivityIndicator size="small" color={colors.black} />
                    : <Text style={styles.submitReviewBtnText}>{myReview ? 'Update' : 'Publish'}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loadingReviews && (
            <ActivityIndicator color={colors.textPrimary} style={{ marginVertical: 16 }} />
          )}

          {!loadingReviews && reviews.length === 0 && (
            <View style={styles.reviewsPlaceholder}>
              <AntDesignIcon name="message1" size={32} color={colors.border} />
              <Text style={styles.reviewsPlaceholderText}>No reviews yet</Text>
            </View>
          )}

          {!loadingReviews && reviews.map((review, index) => (
            <View key={review.idReview}>
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.authorName}</Text>
                  <StarRating rating={review.rating} />
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
              {index < reviews.length - 1 && <View style={styles.reviewDivider} />}
            </View>
          ))}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>{course.price.toFixed(2)} PLN</Text>
        <TouchableOpacity
          style={[styles.wishlistBtn, isPurchased && styles.wishlistBtnDisabled]}
          onPress={() => {
            if (isPurchased) return;
            if (wishlisted) {
              removeFromWishlist(idCourse);
            } else {
              addToWishlist(idCourse);
            }
          }}
          disabled={isPurchased}
          >
          <AntDesignIcon
            name={wishlisted ? 'heart' : 'hearto'}
            size={22}
            color={isPurchased ? colors.textFaint : colors.white}
          />
        </TouchableOpacity>
        {isPurchased ? (
          <View style={[styles.buyBtn, styles.buyBtnPurchased]}>
            <AntDesignIcon name="checkcircle" size={16} color="#4CAF50" />
            <Text style={styles.buyBtnTextPurchased}>Purchased</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.buyBtn, inCart && styles.buyBtnInCart]}
            onPress={() => { if (!inCart) addToCart(idCourse); }}
            disabled={inCart || addingToCart}
            activeOpacity={0.8}>
            <Text style={[styles.buyBtnText, inCart && styles.buyBtnTextInCart]}>
              {inCart ? 'In cart' : addingToCart ? 'Adding…' : 'Add to cart'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ReportModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onSubmit={handleReport}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtnText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  heroWrapper: {},
  heroImage: {
    width: '100%',
    height: 260,
  },
  heroPlaceholder: {
    width: '100%',
    height: 260,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 52,
    left: 16,
    backgroundColor: colors.overlayLight,
    borderRadius: 20,
    padding: 8,
  },
  reportOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 52,
    right: 16,
    backgroundColor: colors.overlayLight,
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryChipText: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '500',
  },
  purchasedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  purchasedChipText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  authorText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ratingValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  ratingCount: {
    color: colors.textFaint,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: colors.textBody,
    fontSize: 14,
    lineHeight: 22,
  },
  reviewsCount: {
    color: colors.textSecondary,
    fontWeight: '400',
    fontSize: 15,
  },
  reviewsPlaceholder: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  reviewsPlaceholderText: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  reviewCard: {
    paddingVertical: 14,
    gap: 5,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewDate: {
    color: colors.textFaint,
    fontSize: 12,
  },
  reviewComment: {
    color: colors.textBody,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 2,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  reviewForm: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  reviewFormTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  reviewInput: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  reviewFormActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  deleteReviewBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitReviewBtn: {
    flex: 1,
    height: 42,
    backgroundColor: colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitReviewBtnDisabled: {
    opacity: 0.5,
  },
  submitReviewBtnText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'android' ? 14 : 34,
    gap: 12,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  wishlistBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistBtnDisabled: {
    opacity: 0.4,
  },
  buyBtn: {
    flex: 2,
    height: 46,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '800',
  },
  buyBtnInCart: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buyBtnTextInCart: {
    color: colors.textSecondary,
  },
  buyBtnPurchased: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
    flexDirection: 'row',
    gap: 8,
  },
  buyBtnTextPurchased: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '700',
  },
});

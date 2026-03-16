import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useCourseDetail } from '../hooks/useCourseDetail';
import StarRating from '../components/StarRating';
import ReportModal from '../components/ReportModal';
import { CourseDetailScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

export default function CourseDetailScreen({ route, navigation }: CourseDetailScreenProps) {
  const { idCourse } = route.params;
  const { data: course, isLoading, isError } = useCourseDetail(idCourse);

  const [wishlisted, setWishlisted] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const handleReport = (reason: string) => {
    // TODO: POST /api/courses/{idCourse}/report
    Alert.alert('Thank you', 'Your report has been submitted.');
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

          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{course.categoryName}</Text>
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

          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewsPlaceholder}>
            <AntDesignIcon name="message1" size={32} color={colors.border} />
            <Text style={styles.reviewsPlaceholderText}>Reviews coming soon</Text>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>{course.price.toFixed(2)} PLN</Text>
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => setWishlisted(prev => !prev)}>
          <AntDesignIcon name={wishlisted ? 'heart' : 'hearto'} size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>Buy now</Text>
        </TouchableOpacity>
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
  categoryChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryChipText: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '500',
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
  reviewsPlaceholder: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  reviewsPlaceholderText: {
    color: colors.textSubtle,
    fontSize: 14,
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
});

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CourseSection from '../components/CourseSection';
import CartIconButton from '../components/CartIconButton';
import NotificationBell from '../components/NotificationBell';
import { usePopularCourses, useNewestCourses, useTopRatedCourses, useCategories } from '../hooks/useCourses';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Course } from '../types/course';
import { HomeScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { firstName } = useCurrentUser();

  const { data: popularCourses = [], isLoading: loadingPopular, isError: errorPopular, refetch: refetchPopular } = usePopularCourses();
  const { data: newestCourses = [], isLoading: loadingNewest, isError: errorNewest, refetch: refetchNewest } = useNewestCourses();
  const { data: topRatedCourses = [], isLoading: loadingTopRated, isError: errorTopRated, refetch: refetchTopRated } = useTopRatedCourses();
  const { data: categories = [] } = useCategories();

  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', { idCourse: course.idCourse });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeLabel}>Hello,</Text>
          <Text style={styles.welcomeName}>
            {firstName ?? 'My Dear Guest 👋'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <NotificationBell onPress={() => navigation.navigate('Notifications')} />
          <CartIconButton onPress={() => navigation.navigate('Cart')} />
        </View>
      </View>

      {/* POPULAR */}
      <CourseSection
        title="🔥 Most Popular"
        courses={popularCourses}
        isLoading={loadingPopular}
        isError={errorPopular}
        onRetry={refetchPopular}
        onSeeAll={() => navigation.navigate('Search', { sortBy: 'popular' })}
        onCoursePress={handleCoursePress}
      />

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesWrap}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.idCategory}
                style={styles.categoryChip}
                onPress={() => navigation.navigate('Search', { idCategory: cat.idCategory })}>
                <Text style={styles.categoryChipText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* NEWEST */}
      <CourseSection
        title="🆕 Newest"
        courses={newestCourses}
        isLoading={loadingNewest}
        isError={errorNewest}
        onRetry={refetchNewest}
        onSeeAll={() => navigation.navigate('Search', { sortBy: 'newest' })}
        onCoursePress={handleCoursePress}
      />

      {/* TOP RATED */}
      <CourseSection
        title="⭐ Top Rated"
        courses={topRatedCourses}
        isLoading={loadingTopRated}
        isError={errorTopRated}
        onRetry={refetchTopRated}
        onSeeAll={() => navigation.navigate('Search', { sortBy: 'top-rated' })}
        onCoursePress={handleCoursePress}
      />

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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 28,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  welcomeLabel: {
    color: colors.textLabel,
    fontSize: 14,
  },
  welcomeName: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
});

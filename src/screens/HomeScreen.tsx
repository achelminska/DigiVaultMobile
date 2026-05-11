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
import AppHeader from '../components/AppHeader';
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

      <AppHeader
        label="Hello,"
        title={firstName ?? 'My Dear Guest 👋'}
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onCartPress={() => navigation.navigate('Cart')}
        paddingBottom={28}
      />

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

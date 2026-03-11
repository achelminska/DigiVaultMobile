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
import { usePopularCourses, useNewestCourses, useTopRatedCourses, useCategories } from '../hooks/useCourses';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Course, Category } from '../types/course';

export default function HomeScreen({ navigation }: any) {
  const { firstName } = useCurrentUser();

  const { data: popularCourses = [], isLoading: loadingPopular } = usePopularCourses();
  const { data: newestCourses = [], isLoading: loadingNewest } = useNewestCourses();
  const { data: topRatedCourses = [], isLoading: loadingTopRated } = useTopRatedCourses();
  const { data: categories = [] } = useCategories();

  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', { idCourse: course.idCourse });
    console.log('Otwarto kurs:', course.idCourse);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeLabel}>Witaj,</Text>
          <Text style={styles.welcomeName}>
            {firstName ?? 'w DigiVault 👋'}
          </Text>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <AntDesignIcon name="shoppingcart" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* POPULAR */}
      <CourseSection
        title="🔥 Najpopularniejsze"
        courses={popularCourses}
        isLoading={loadingPopular}
        onSeeAll={() => navigation.navigate('Search', { sortBy: 'popular' })}
        onCoursePress={handleCoursePress}
      />

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategorie</Text>
          <View style={styles.categoriesWrap}>
            {(categories as Category[]).map(cat => (
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
        title="🆕 Najnowsze"
        courses={newestCourses}
        isLoading={loadingNewest}
        onSeeAll={() => navigation.navigate('Search', { sortBy: 'newest' })}
        onCoursePress={handleCoursePress}
      />

      {/* TOP RATED */}
      <CourseSection
        title="⭐ Najwyżej oceniane"
        courses={topRatedCourses}
        isLoading={loadingTopRated}
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
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 28,
  },
  welcomeLabel: {
    color: 'gray',
    fontSize: 14,
  },
  welcomeName: {
    color: 'white',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  cartBtn: {
    padding: 8,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    color: 'white',
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
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
});

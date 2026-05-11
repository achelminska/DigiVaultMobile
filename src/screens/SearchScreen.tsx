import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AppHeader from '../components/AppHeader';
import CourseCard from '../components/CourseCard';
import { useCourseSearch, useCategories } from '../hooks/useCourses';
import { Course } from '../types/course';
import { SearchScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

const SORT_OPTIONS = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'top-rated' },
];

export default function SearchScreen({ navigation, route }: SearchScreenProps) {
  const params = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(params?.idCategory);
  const [sortBy, setSortBy] = useState<string | undefined>(params?.sortBy);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (params?.idCategory) setSelectedCategory(params.idCategory);
    if (params?.sortBy) setSortBy(params.sortBy);
  }, [params?.idCategory, params?.sortBy]);

  const { data, isLoading, isError, refetch } = useCourseSearch({
    search: debouncedQuery || undefined,
    idCategory: selectedCategory,
    sortBy,
  });
  const courses = data?.items || [];

  const { data: categories = [] } = useCategories();

  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', { idCourse: course.idCourse });
  };

  const toggleCategory = (id: number) => {
    setSelectedCategory(prev => (prev === id ? undefined : id));
  };

  const toggleSort = (value: string) => {
    setSortBy(prev => (prev === value ? undefined : value));
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <CourseCard course={item} onPress={() => handleCoursePress(item)} />
  );

  return (
    <FlatList
      style={styles.container}
      data={courses}
      keyExtractor={item => item.idCourse.toString()}
      renderItem={renderCourse}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          {/* HEADER */}
          <AppHeader
            title="Search"
            onNotificationsPress={() => navigation.navigate('Notifications')}
            onCartPress={() => navigation.navigate('Cart')}
          />

          {/* SEARCH INPUT */}
          <View style={styles.searchContainer}>
            <AntDesignIcon name="search1" size={16} color={colors.textFaint} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              placeholderTextColor={colors.textFaint}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <AntDesignIcon name="close" size={14} color={colors.textFaint} />
              </TouchableOpacity>
            )}
          </View>

          {/* SORT OPTIONS */}
          <View style={styles.sortRow}>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.sortChip, sortBy === opt.value && styles.sortChipActive]}
                onPress={() => toggleSort(opt.value)}>
                <Text style={[styles.sortChipText, sortBy === opt.value && styles.sortChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CATEGORIES */}
          {categories.length > 0 && (
            <View style={styles.categoriesWrap}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.idCategory}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.idCategory && styles.categoryChipActive,
                  ]}
                  onPress={() => toggleCategory(cat.idCategory)}>
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.idCategory && styles.categoryChipTextActive,
                    ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* RESULTS LABEL */}
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>Results</Text>
            {!isLoading && !isError && (
              <Text style={styles.resultsCount}>{courses.length} courses</Text>
            )}
          </View>

          {/* STATES */}
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
              <AntDesignIcon name="search1" size={36} color={colors.iconFaint} />
              <Text style={styles.emptyText}>No courses found</Text>
              <Text style={styles.emptySubText}>Try different keywords or filters</Text>
            </View>
          )}
        </View>
      }
      ListFooterComponent={<View style={{ height: 40 }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    padding: 0,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sortChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  sortChipActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  sortChipText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  sortChipTextActive: {
    color: colors.black,
    fontWeight: '700',
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  categoryChipActive: {
    backgroundColor: colors.border,
  },
  categoryChipText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
  },
  resultsCount: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  errorWrap: {
    alignItems: 'center',
    marginTop: 40,
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
    alignItems: 'center',
    marginTop: 50,
    gap: 8,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});

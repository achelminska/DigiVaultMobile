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
import { usePurchasedCourses } from '../hooks/useCourses';
import { Course } from '../types/course';
import { MyVaultScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

export default function MyVaultScreen({ navigation }: MyVaultScreenProps) {
  const { data: courses = [], isLoading, isError, refetch } = usePurchasedCourses();

  const renderItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('CourseDetail', { idCourse: item.idCourse })}
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
      </View>

      <AntDesignIcon name="right" size={14} color={colors.textFaint} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Vault"
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch} />

      {!isLoading && !isError && courses.length === 0 && (
        <EmptyState
          icon="playcircleo"
          title="No courses yet"
          subtitle="Your purchased courses will appear here"
        />
      )}

      {!isLoading && !isError && courses.length > 0 && (
        <FlatList
          data={courses}
          keyExtractor={item => item.idCourse.toString()}
          renderItem={renderItem}
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
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: colors.imagePlaceholder,
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
    gap: 4,
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
  separator: {
    height: 1,
    backgroundColor: colors.divider,
  },
});

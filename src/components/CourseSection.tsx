import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CourseCard from './CourseCard';
import { Course } from '../types/course';
import { colors } from '../config/theme';

function ErrorCard({ onRetry }: { onRetry?: () => void }) {
  return (
    <View style={errorStyles.card}>
      <AntDesignIcon name="exclamationcircleo" size={24} color={colors.textSecondary} />
      <Text style={errorStyles.text}>Failed to load</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={errorStyles.retryBtn}>
          <Text style={errorStyles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const errorStyles = StyleSheet.create({
  card: {
    height: 230,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  retryBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  retryText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
});

interface Props {
  title: string;
  courses: Course[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onSeeAll: () => void;
  onCoursePress: (course: Course) => void;
}

function SeeAllCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.seeAllCard} onPress={onPress} activeOpacity={0.7}>
      <AntDesignIcon name="arrowright" size={26} color={colors.textPrimary} />
      <Text style={styles.seeAllText}>See{'\n'}all</Text>
    </TouchableOpacity>
  );
}

export default function CourseSection({ title, courses, isLoading, isError, onRetry, onSeeAll, onCoursePress }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {isLoading ? (
        <ActivityIndicator color={colors.white} style={{ marginVertical: 20 }} />
      ) : isError ? (
        <ErrorCard onRetry={onRetry} />
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={courses}
          keyExtractor={item => item.idCourse.toString()}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={() => onCoursePress(item)} />
          )}
          ListFooterComponent={<SeeAllCard onPress={onSeeAll} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 36,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  seeAllCard: {
    width: 90,
    height: 230,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  seeAllText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});

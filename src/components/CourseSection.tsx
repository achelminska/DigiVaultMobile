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

interface Props {
  title: string;
  courses: Course[];
  isLoading: boolean;
  onSeeAll: () => void;
  onCoursePress: (course: Course) => void;
}

function SeeAllCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.seeAllCard} onPress={onPress} activeOpacity={0.7}>
      <AntDesignIcon name="arrowright" size={26} color="white" />
      <Text style={styles.seeAllText}>Zobacz{'\n'}wszystkie</Text>
    </TouchableOpacity>
  );
}

export default function CourseSection({ title, courses, isLoading, onSeeAll, onCoursePress }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {isLoading ? (
        <ActivityIndicator color="white" style={{ marginVertical: 20 }} />
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
    color: 'white',
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
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  seeAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});

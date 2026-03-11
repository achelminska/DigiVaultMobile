import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { Course } from '../types/course';

interface Props {
  course: Course;
  onPress: () => void;
}

export default function CourseCard({ course, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>

      {course.imageUrl ? (
        <Image source={{ uri: course.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <AntDesignIcon name="playcircleo" size={32} color="#555" />
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{course.authorName}</Text>

        <View style={styles.ratingRow}>
          <AntDesignIcon name="star" size={11} color="white" />
          <Text style={styles.ratingValue}>
            {course.averageRating > 0 ? course.averageRating.toFixed(1) : '—'}
          </Text>
          {course.ratingsCount > 0 && (
            <Text style={styles.ratingCount}>({course.ratingsCount})</Text>
          )}
        </View>

        <Text style={styles.price}>{course.price.toFixed(2)} zł</Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 175,
    height: 230,
    backgroundColor: '#111',
    borderRadius: 14,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 10,
    gap: 3,
  },
  title: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  author: {
    color: '#888',
    fontSize: 11,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  ratingValue: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  ratingCount: {
    color: '#888',
    fontSize: 11,
  },
  price: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 5,
  },
});

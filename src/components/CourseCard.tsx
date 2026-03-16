import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { Course } from '../types/course';
import { colors } from '../config/theme';

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
          <AntDesignIcon name="playcircleo" size={32} color={colors.iconFaint} />
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{course.authorName}</Text>

        <View style={styles.ratingRow}>
          <AntDesignIcon name="star" size={11} color={colors.textPrimary} />
          <Text style={styles.ratingValue}>
            {course.averageRating > 0 ? course.averageRating.toFixed(1) : '—'}
          </Text>
          {course.ratingsCount > 0 && (
            <Text style={styles.ratingCount}>({course.ratingsCount})</Text>
          )}
        </View>

        <Text style={styles.price}>{course.price.toFixed(2)} PLN</Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 175,
    height: 230,
    backgroundColor: colors.card,
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
    backgroundColor: colors.imagePlaceholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 10,
    gap: 3,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  author: {
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  ratingCount: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 5,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { colors } from '../config/theme';

interface Props {
  rating: number;
}

export default function StarRating({ rating }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map(star => (
        <AntDesignIcon
          key={star}
          name={star <= Math.round(rating) ? 'star' : 'staro'}
          size={14}
          color={colors.textPrimary}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});

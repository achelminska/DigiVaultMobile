import React from 'react';
import { View, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

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
          color="white"
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

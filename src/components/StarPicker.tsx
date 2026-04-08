import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { colors } from '../config/theme';

interface Props {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}

export default function StarPicker({ value, onChange, size = 28, disabled = false }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => !disabled && onChange(star)}
          activeOpacity={disabled ? 1 : 0.7}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <AntDesignIcon
            name={star <= value ? 'star' : 'staro'}
            size={size}
            color={star <= value ? '#F5A623' : colors.border}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
});

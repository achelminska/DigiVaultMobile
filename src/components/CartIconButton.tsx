import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useCart } from '../hooks/useCart';
import { colors } from '../config/theme';

interface Props {
  onPress: () => void;
}

export default function CartIconButton({ onPress }: Props) {
  const { data: cart = [] } = useCart();
  const count = cart.length;

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <AntDesignIcon name="shoppingcart" size={26} color={colors.textPrimary} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
});

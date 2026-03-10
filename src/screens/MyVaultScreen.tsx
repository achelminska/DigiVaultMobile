import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyVaultScreen() {
  return (
    <View style={styles.container}>
      <Text>My Vault</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

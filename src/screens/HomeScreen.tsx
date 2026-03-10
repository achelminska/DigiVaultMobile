import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }: any): React.JSX.Element {

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj w DigiVault! 🎉</Text>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText} onPress={handleLogout}>Wyloguj</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    padding: 15,
    backgroundColor: '#E4E4E4',
    borderRadius: 20,
    width: 200,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default HomeScreen;
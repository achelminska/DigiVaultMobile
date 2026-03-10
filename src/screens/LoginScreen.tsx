import React, {useEffect, useRef} from 'react';
import {Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, View, Animated, Dimensions} from 'react-native';
import {useState} from 'react';
import {SafeAreaView } from 'react-native-safe-area-context';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

function LoginScreen({ navigation }: any): React.JSX.Element {

const BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5052'
    : 'http://localhost:5052';
    
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");

 const logoY = useRef(new Animated.Value(SCREEN_HEIGHT / 2 - 144)).current;
 const contentY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

 useEffect(() => {
   setTimeout(() => {
     Animated.parallel([
       Animated.timing(logoY, {
         toValue: 0,
         duration: 700,
         useNativeDriver: true,
       }),
       Animated.timing(contentY, {
         toValue: 0,
         duration: 700,
         useNativeDriver: true,
       }),
     ]).start();
   }, 1000);
 }, []);

 const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: email.trim(),
          password: password.trim(),
        }),
      });


    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('token', data.token);
      console.log('Zalogowano! Token:', data.token);
      navigation.navigate('Home');
    } else {
      console.log('Błąd:', data.message);
      Alert.alert('Błąd', data.message);
    }
  } catch (error) {
    console.log('Błąd połączenia:', error);
    Alert.alert('Błąd', String(error));
  }
};
return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={{transform: [{translateY: logoY}]}}>
        <Image
        source={require('../assets/logoDV.png')}
        style={styles.logo}
        resizeMode="contain"
      />
        </Animated.View>
      <Animated.View style={[styles.content, {transform: [{translateY: contentY}]}]}>
      <Text style={styles.title}>Log in</Text>
      <TextInput
        style={styles.input}
        placeholder="Login"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        caretHidden={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        caretHidden={true}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
      <View style={styles.leftLine}></View>
      <Text style={styles.footerText}>Or login with</Text>
      <View style={styles.rightLine}></View>
      </View>
      <View style={styles.icons}>
      <TouchableOpacity style={styles.iconGoogle}>
        <AntDesignIcon name="google" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconApple}>
        <AntDesignIcon name="apple1" size={24} color="black" />
      </TouchableOpacity>
      </View>
      <View style={styles.signUpRow}>
  <Text style={styles.subtitle}>Don't have an account? </Text>
  <TouchableOpacity onPress={() => {}}>
    <Text style={styles.subtitleLink}>Sign up</Text>
  </TouchableOpacity>
</View>
      </Animated.View>

      </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  logo: {
    alignSelf: 'center',
    width: 300,
    height: 200,
    marginBottom: 0,
    marginTop: 0,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    minHeight: SCREEN_HEIGHT,
    backgroundColor: '#E4E4E4',
    borderTopLeftRadius: 80,
  },
  title: {
    marginTop: 10,
    marginBottom: 25,
    color: 'black',
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
  },
  input: {
    alignSelf: 'center',
    width: '80%',
    padding: 17,
    marginTop: 30,
    backgroundColor: 'black',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#A9A9A9',
    color: '#A9A9A9',
    fontSize: 20,
    fontWeight: '200',
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
    width: '80%',
    padding: 15,
    marginTop: 60,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  buttonText: {
    color: '#D6D6D6',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 50,
  },
  leftLine: {
    flex: 1,
    alignSelf: 'center',
    height: 1,
    backgroundColor: 'black',
  },
  rightLine: {
    flex: 1,
    alignSelf: 'center',
    height: 1,
    backgroundColor: 'black',
  },
  footerText: {
    marginHorizontal: 15,
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  iconGoogle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    fontSize: 18,
    lineHeight: 50,
  },
  iconApple: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 25,
    borderWidth: 1,
    fontSize: 18,
    lineHeight: 50,
  },
  subtitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  subtitleLink: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
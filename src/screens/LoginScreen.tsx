import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useLogin } from '../hooks/useLogin';
import { LoginScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const logoY = useRef(new Animated.Value(SCREEN_HEIGHT / 2 - 144)).current;
  const contentY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoY, { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.timing(contentY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]).start();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const { mutate: handleLogin, isPending } = useLogin(() => {
    navigation.navigate('Home');
  });

  const onLoginPress = () => {
    if (!login.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter your login and password.');
      return;
    }
    handleLogin({ login: login.trim(), password: password.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: logoY }] }}>
        <Image
          source={require('../assets/logoDV.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.content, { transform: [{ translateY: contentY }] }]}>
        <Text style={styles.title}>Log in</Text>

        <TextInput
          style={styles.input}
          placeholder="Login"
          placeholderTextColor={colors.textLabel}
          value={login}
          onChangeText={setLogin}
          caretHidden={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textLabel}
          value={password}
          onChangeText={setPassword}
          caretHidden={true}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={onLoginPress} disabled={isPending}>
          <Text style={styles.buttonText}>{isPending ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.line} />
          <Text style={styles.footerText}>Or login with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.icons}>
          <TouchableOpacity style={styles.iconBtn}>
            <AntDesignIcon name="google" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <AntDesignIcon name="apple1" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpRow}>
          <Text style={styles.subtitle}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
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
    backgroundColor: colors.black,
  },
  logo: {
    alignSelf: 'center',
    width: 300,
    height: 200,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    minHeight: SCREEN_HEIGHT,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 80,
  },
  title: {
    marginTop: 10,
    marginBottom: 25,
    color: colors.black,
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
  },
  input: {
    alignSelf: 'center',
    width: '80%',
    padding: 17,
    marginTop: 30,
    backgroundColor: colors.black,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.inputText,
    color: colors.inputText,
    fontSize: 20,
    fontWeight: '200',
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
    width: '80%',
    padding: 15,
    marginTop: 60,
    backgroundColor: colors.black,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.textMuted,
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
  line: {
    flex: 1,
    alignSelf: 'center',
    height: 1,
    backgroundColor: colors.black,
  },
  footerText: {
    marginHorizontal: 15,
    color: colors.black,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
  },
  iconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
  },
  subtitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
  },
  subtitleLink: {
    color: colors.black,
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

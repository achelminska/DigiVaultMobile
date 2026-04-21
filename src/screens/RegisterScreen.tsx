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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegister } from '../hooks/useRegister';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../config/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function RegisterScreen({ navigation }: Props) {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const logoY = useRef(new Animated.Value(SCREEN_HEIGHT / 2 - 144)).current;
  const contentY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoY, { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.timing(contentY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]).start();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const { mutate: handleRegister, isPending } = useRegister(() => {
    Alert.alert('Success', 'Account created. You can now log in.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  });

  const onRegisterPress = () => {
    if (!login.trim() || !email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    handleRegister(
      {
        login: login.trim(),
        email: email.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      {
        onError: (error: any) => {
          const message = Array.isArray(error?.errors)
            ? error.errors.join('\n')
            : error?.message ?? 'Failed to create account.';
          Alert.alert('Registration error', message);
        },
      }
    );
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
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sign up</Text>

          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor={colors.textLabel}
            value={firstName}
            onChangeText={setFirstName}
            caretHidden={true}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor={colors.textLabel}
            value={lastName}
            onChangeText={setLastName}
            caretHidden={true}
            autoCapitalize="words"
          />

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
            placeholder="Email"
            placeholderTextColor={colors.textLabel}
            value={email}
            onChangeText={setEmail}
            caretHidden={true}
            autoCapitalize="none"
            keyboardType="email-address"
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

          <TouchableOpacity style={styles.button} onPress={onRegisterPress} disabled={isPending}>
            <Text style={styles.buttonText}>{isPending ? 'Creating account...' : 'Create account'}</Text>
          </TouchableOpacity>

          <View style={styles.signInRow}>
            <Text style={styles.subtitle}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.subtitleLink}>Log in</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
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
    backgroundColor: colors.surface,
    borderTopLeftRadius: 80,
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    color: colors.black,
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
  },
  input: {
    alignSelf: 'center',
    width: '80%',
    padding: 17,
    marginTop: 20,
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
    marginTop: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
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
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

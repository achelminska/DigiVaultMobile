import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { Platform } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MyVaultScreen from '../screens/MyVaultScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AccountScreen from '../screens/AccountScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import { RootStackParamList, RootTabParamList } from '../types/navigation';
import { colors } from '../config/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.black,
        borderTopWidth: 0,
        height: 80,
        paddingTop: 5,
        paddingBottom: Platform.OS === 'android' ? 0 : 10,
      },
      tabBarIconStyle: {
        marginBottom: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
      },
      tabBarActiveTintColor: colors.white,
      tabBarInactiveTintColor: colors.textLabel,
    }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <AntDesignIcon name="star" size={28} color={color} /> }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ color }) => <AntDesignIcon name="search1" size={28} color={color} /> }}
      />
      <Tab.Screen
        name="My Vault"
        component={MyVaultScreen}
        options={{ tabBarIcon: ({ color }) => <AntDesignIcon name="playcircleo" size={28} color={color} /> }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{ tabBarIcon: ({ color }) => <AntDesignIcon name="hearto" size={28} color={color} /> }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarIcon: ({ color }) => <AntDesignIcon name="user" size={28} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}